# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Follow the guidelines for making a commit. If the guidelines aren't followed your pull request will be closed.
2. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
3. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
4. Increase the version numbers in any examples files and the README.md to the new version that this pull request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Commit Guidelines

All commits made should follow the [Semantic Release](https://github.com/semantic-release/semantic-release#commit-message-format) commit message format.

## Pull Request Guidelines

A PR should be named using the following anatomy:

`[emoji]` `(#issue)` `summary`

As an example: `[➕] (#126) cool thing added`

### emoji

The emoji should be the first thing in the name, to let everyone know what kind of change the PR is putting forward. Here is a table of the standard emojis, and why they should be used.

| Emoji                                   | Keyword    | Meaning                                                |
|-----------------------------------------|------------|--------------------------------------------------------|
| :heavy_plus_sign: `:heavy_plus_sign:`   | `add`      | Create a capability e.g. feature, test, dependency.    |
| :heavy_minus_sign: `:heavy_minus_sign:` | `remove`   | Remove a capability e.g. feature, test, dependency.    |
| :hammer: `:hammer:`                     | `refactor` | An update to existing code and/or refactoring.         |
| :bug: `:bug:`                           | `fix`      | Fix an issue e.g. bug, typo, accident, misstatement.   |
| :up: `:up:`                             | `bump`     | Increase the version of something e.g. dependency.     |
| :bricks: `:bricks:`                     | `build`    | Change *only* to the build process, tooling, or infra. |
| :memo: `:memo:`                         | `docs`     | A change to documentation *only*.                      |
| :arrow_right_hook: `:arrow_right_hook:` | `revert`   | Reverting a previous commit.                           |
| :knot: `:knot:`                         | `merge`    | Merging a branch into another.                         |

### issue

Following the emoji is the issue number  - this is the issue the PR addresses. It is formatted as `(#XXX)` where XXX is the GitHub issue number.

### summary

This is a short summary of what your commit is doing.

## Code of Conduct

Our Code of Conduct is located at `CODE_OF_CONDUCT.md`.
