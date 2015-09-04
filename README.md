# prog3-marker

Single-page application to aid in the marking of programming assignments.

## Documentation

### Rules

A rule file (`rules.txt`) is a plain text file. Example rule file:

    Programming Environment
    	Source code written in Windows [-10]
    	Root user used when creating script file [-2]
    	Source code [/-15]
    		Did not include source code [-15]
    		Style (comments)
    			Multi-line comments [/-3]
    				/* not on its own line [-1]
    				*/ not on its own line [-1]
    				* not on every line [-1]
    				No space between * and text on the line [-1]
    				*'s do no line up vertically [-1]
    			Redundant comment [-1/-1]

Rule file syntax:

- One rule per line.
- Point values for rules are placed at the end of the line inside square brackets.
- Rules can be nested below other rules by indenting a rule one more than its parent.
- Rules that have children cannot have point values.
- Maximum point values for rules AND nested rules can be added in the square brackets with a preceding forward slash (`/`).
- Indentation must be done using tabs.
- Lines starting with `#` are comments and are ignored.

## License

[GPLv3](https://www.gnu.org/copyleft/gpl.html)

## Author

Tim Cooper <<tim.cooper@layeh.com>>
