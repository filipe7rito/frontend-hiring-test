# CI/CD Plan

Workflow plan for releasing new software.

## Approaches

We can have 2 approaches regarding the architecture we have implemented.
e.g:

- Micro frontends architechture
- Monolith architechture

### Micro frontends architechture

With a Micro frontend architecture assuming that the application would be splitted by domain,
we would only work on that business domain repository.

1. Open a `feature` PR against `master`
   - On the PR we would run our CI steps [example](https://github.com/filipe7rito/frontend-hiring-test/pull/1)
     1. Build
     2. Test
   - Deploy in a PR Preview environment like in the PR [example](https://github.com/filipe7rito/frontend-hiring-test/pull/1)
2. Only with the CI steps `passing`, comments resolved and branches up to date we would be allowed to merge to `master`
3. Before merging to master we would run `e2e` tests to guarante that we don't break `Production`
4. Deploy to `Production` environment

This approach improves the developer experience and allows be quicker on delivering value.

### Monolith architechture

It would be identical to the approach above but with the following differences:

- Since teams would be working in a single codebase we would have a `Development` environment
- This `Development` environment would gather all the meaningfull `features` before releasing to `Production`
- We would run `e2e` tests before merging to `Production`
- Deploy into `Production`

This approach it´s safer but has more dependencies to release some value.

### Versoning

We could implement `versioning` based on [Semantic Versioning](https://semver.org/) to match a `changelog` to the new software version like [example](https://github.com/TanStack/query/releases).

### Testing Features

Even though we have automated tests we might want do other kinds of tests:

- `Smoke tests`
  To test for example what we have in `Develpment` before launching into `Production`

- `A/B testing`
  This would allow delivering new features like `archive` feature in `Production` but only available for some users.
  This could be accomplished in 2 ways:
  - Features flags
  - Demo user profiles

### Notes

This repository contains diferent environments as example:

- [Production](https://github.com/filipe7rito/frontend-hiring-test/deployments/activity_log?environment=Production)
- [Pull Request Preview](https://github.com/filipe7rito/frontend-hiring-test/deployments/activity_log?environment=Preview)
