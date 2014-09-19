# prog3-marker

Single-page application to aid in the marking of programming assignments.

## Installation

Releases are available on the [GitHub project page](https://github.com/bontibon/prog3-marker/releases). Building from source can be done in the following manner:

1. Clone or download an archived copy of the source code repository.
2. Install [Node.js](http://nodejs.org/) and [Bower](http://bower.io/).
3. Run `npm install` and `bower install` inside of the source code directory to install dependencies.
4. Add rules to the `rules.json` file.
5. Run `npm start` to start server.

## Documentation

### Rules

A rule file must contain a JSON encoded array of **Rule** objects.  Example:

    [
      {"id": "environment", "description": "Programming Environment"},
      {"id": "environment-windows", "parent": "environment", "description":
        "Source code written using Windows", "value": -10},
      {"id": "execution-missing", "description": "Program execution is missing",
        "value": -10}
    ]

A **Rule** can have the following properties:

  - *string|integer* `id` (required)
    - a unique identifier (primary key) for the rule
  - *string* `description` (required)
    - a helpful description of the rule
  - *string|integer* `parent` (optional)
    - the `id` of the parent rule
  - *integer* `maximum` (optional)
    - the maximum value that will be added/deducted for the rule or the rule's children
  - *integer* `value` (optional)
    - the point value of the rule (can be positive or negative). Rules that have children cannot has this property.
  - *integer* `child-count` (optional)
    - the number of active children required to award the `child-bonus`.
  - *integer* `child-bonus` (optional)
    - the bonus value that will be applied to the final mark.

## License

[GPLv3](https://www.gnu.org/copyleft/gpl.html)

## Author

Tim Cooper <<tim.cooper@layeh.com>>
