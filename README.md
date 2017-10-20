# estimationsChromePlugin
Estimations extension for Microsoft Planner

This extension sums up numbers given in the title of Microsoft Planner cards
This is a plugin for Microsoft Planner which allows you to organize tasks as cards in multiple columns.

GOAL
This plugin will extend the functionality of Planner by estimations. For each card, you can set an original estimation and a remaining estimation. Typically, the original estimation is given at the time when you create a new card. Only when you start working on a card, you will update the remaining estimation. E.g., imagine you create a card labelled "Prepare dinner", and you estimate the effort with "3" hours. This would be your original estimation. Now, if you start working on that card, and you take a break after "1" hour, you would update the remaining estimation with "2" hours.

HOW DOES IT WORK?
The original estimation will be given as number in round brackets as part of the card's label, while the remaining estimation will be given as number in square brackets. E.g., you would write "(3) Prepare Dinner [5]".

The plugin sums up all original (remaining) estimations for all cards of a column, and displays the sum as part of the column's title.

More technically speaking, the plugin parses the title for all cards on the board. Text content between parentheses will be removed from the title and added as a label at the bottom of each card. The same is true for content between square brackets. If content can be parsed as a float value, it will contribute to a sum.