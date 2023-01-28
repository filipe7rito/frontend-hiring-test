import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { Box, Button, Spacer, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import Spinner from '../components/Spinner';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  if (loading) return <Spinner />;
  if (error) return <p>ERROR</p>;

  const { call } = data;

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        {`Calls Details`}
      </Typography>
      <Spacer space="s">
        <Button mode="link" size="small" onClick={() => navigate(-1)}>
          {`Return`}
        </Button>
      </Spacer>
      <Box overflowY="auto" bg="#F7F7F7" boxShadow={5} p={4} borderRadius={16}>
        <div>{`ID: ${call.id}`}</div>
        <div>{`Type: ${call.call_type}`}</div>
        <div>{`Created at: ${formatDate(call.created_at)}`}</div>
        <div>{`Direction: ${call.direction}`}</div>
        <div>{`From: ${call.from}`}</div>
        <div>{`Duration: ${formatDuration(call.duration / 1000)}`}</div>
        <div>{`Is archived: ${call.is_archived}`}</div>
        <div>{`To: ${call.to}`}</div>
        <div>{`Via: ${call.via}`}</div>
        {call.notes?.map((note: Note, index: number) => {
          return <div key={`${note.id}-${index}`}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
      </Box>
    </>
  );
};
