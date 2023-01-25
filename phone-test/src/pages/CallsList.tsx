import {
  ArchiveFilled,
  ArchiveOutlined,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Flex,
  Grid,
  Icon,
  IconButton,
  Pagination,
  Spacer,
  SpinnerOutlined,
  Tooltip,
  Typography,
  useToast
} from '@aircall/tractor';
import { useMutation, useQuery } from '@apollo/client';
import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Spinner from '../components/Spinner';
import { ARCHIVE_CALL } from '../gql/mutations/archiveCall';
import { PAGINATED_CALLS } from '../gql/queries';
import { formatDate, formatDuration } from '../helpers/dates';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 5;
const ARCHIVE_OPERATION = 'ARCHIVE_OPERATION';

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { showToast, removeToast } = useToast();
  const [archiveMutation] = useMutation(ARCHIVE_CALL);

  // Ref to keep track of the call being archived
  let archivingCallId = useRef<string | undefined>();

  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * CALLS_PER_PAGE,
      limit: CALLS_PER_PAGE
    }
    // onCompleted: () => handleRefreshToken(),
  });

  if (loading) return <Spinner />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const handleArchiveCall = (call: Call) => {
    const { id } = call;

    removeToast(ARCHIVE_OPERATION);
    archivingCallId.current = id;

    archiveMutation({
      variables: {
        id
      },
      onCompleted: ({ archiveCall }) => {
        archivingCallId.current = undefined;
        showToast({
          id: ARCHIVE_OPERATION,
          message: archiveCall.is_archived ? 'Call archived' : 'Call unarchived',
          variant: 'success'
        });
      },
      onError: () => {
        archivingCallId.current = undefined;
        showToast({
          id: ARCHIVE_OPERATION,
          message: 'Error while archiving call',
          variant: 'error'
        });
      }
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Spacer space={3} direction="vertical">
        {calls.map((call: Call) => {
          const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
          const title =
            call.call_type === 'missed'
              ? 'Missed call'
              : call.call_type === 'answered'
              ? 'Call answered'
              : 'Voicemail';
          const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
          const duration = formatDuration(call.duration / 1000);
          const date = formatDate(call.created_at);
          const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

          return (
            <Box
              key={call.id}
              bg="#F7F7F7"
              boxShadow={5}
              borderRadius={16}
              cursor="pointer"
              onClick={() => handleCallOnClick(call.id)}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#E5E5E5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F7F7F7')}
            >
              <Grid
                data-testid={`call-item`}
                gridTemplateColumns="32px 1fr max-content"
                columnGap={2}
                borderBottom="1px solid"
                borderBottomColor="neutral-700"
                alignItems="center"
                px={4}
                py={2}
              >
                <Box>
                  <Icon component={icon} size={32} />
                </Box>
                <Box>
                  <Typography variant="body">{title}</Typography>
                  <Typography variant="body2">{subtitle}</Typography>
                </Box>

                <Flex alignItems="center">
                  <Box>
                    <Typography variant="caption" textAlign="right">
                      {duration}
                    </Typography>
                    <Typography variant="caption">{date}</Typography>
                  </Box>

                  <Spacer space="s" ml="12px">
                    <Tooltip title={call.is_archived ? 'Unarchive' : 'Archive'}>
                      {archivingCallId.current === call.id ? (
                        <Icon key={call.id} component={SpinnerOutlined} spin />
                      ) : (
                        <IconButton
                          key={call.id}
                          size={24}
                          component={call.is_archived ? ArchiveFilled : ArchiveOutlined}
                          color="#01B288"
                          onClick={e => {
                            e.stopPropagation();
                            handleArchiveCall(call);
                          }}
                        />
                      )}
                    </Tooltip>
                  </Spacer>
                </Flex>
              </Grid>
              <Box px={4} py={2}>
                <Typography variant="caption">{notes}</Typography>
              </Box>
            </Box>
          );
        })}
      </Spacer>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={CALLS_PER_PAGE}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
