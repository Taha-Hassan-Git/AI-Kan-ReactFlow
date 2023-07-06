const exampleData = [
  {
    id: 0,
    name: "Snake game",
    tasks: [
      {
        id: 0,
        title: "Setup development environment",
        description: "Install relevant dependencies",
        done: false,
        issues: [],
      },
      {
        id: 1,
        title: "Create game board",
        description:
          "Implement the main game board where the game will be played",
        done: false,
        issues: [
          {
            id: 0,
            taskId: 1,
            title: "Design board layout",
            description:
              "Design the layout of the game board using CSS grid or similar",
            timeEstimate: "2 hours",
            done: false,
          },
          {
            id: 1,
            taskId: 1,
            title: "Implement board",
            description: "Create the game board component",
            timeEstimate: "2 hours",
            done: false,
          },
        ],
      },
      {
        id: 2,
        title: "Create snake",
        description: "Implement the snake that the player will control",
        done: false,
        issues: [
          {
            id: 2,
            taskId: 2,
            title: "Design snake",
            description: "Create a design for the snake and its movement",
            timeEstimate: "2 hours",
            done: false,
          },
          {
            id: 3,
            taskId: 2,
            title: "Implement snake",
            description: "Create the snake component",
            timeEstimate: "4 hours",
            done: false,
          },
        ],
      },
      {
        id: 3,
        title: "Implement game logic",
        description:
          "Handle the main game mechanics like snake movement, score keeping, and collision detection",
        done: false,
        issues: [
          {
            id: 4,
            taskId: 3,
            title: "Implement snake movement",
            description:
              "Write the code to handle snake movement in response to player input",
            timeEstimate: "3 hours",
            done: false,
          },
          {
            id: 5,
            taskId: 3,
            title: "Implement score keeping",
            description:
              "Write the code to keep track of and display the player's score",
            timeEstimate: "2 hours",
            done: false,
          },
          {
            id: 6,
            taskId: 3,
            title: "Implement collision detection",
            description:
              "Write the code to detect collisions between the snake and the game board or the snake and itself",
            timeEstimate: "3 hours",
            done: false,
          },
        ],
      },
      {
        id: 4,
        title: "Testing and Debugging",
        description:
          "Run tests and debug to ensure that the game runs as expected",
        done: false,
        issues: [
          {
            id: 7,
            taskId: 4,
            title: "Write tests",
            description: "Write tests to verify the functionality of the game",
            timeEstimate: "2 hours",
            done: false,
          },
          {
            id: 8,
            taskId: 4,
            title: "Debug game",
            description: "Fix any issues that arise during testing",
            timeEstimate: "2 hours",
            done: false,
          },
        ],
      },
    ],
  },
]

export default exampleData

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const example2 = {
  name: "Todo list app",
  tasks: [
    {
      title: "Setup development environment",
      description: "Install and setup necessary software to begin development",
      done: false,
      issues: [],
    },
    {
      title: "Create todo list component",
      description: "Implement the main todo list component",
      done: false,
      issues: [
        {
          title: "Design todo list layout",
          description:
            "Design the layout of the todo list using CSS grid or similar",
          timeEstimate: "2 hours",
          done: false,
        },
        {
          title: "Implement todo list",
          description: "Create the todo list component",
          timeEstimate: "2 hours",
          done: false,
        },
      ],
    },
    {
      title: "Create todo item component",
      description:
        "Implement the todo item component that will be used in the todo list",
      done: false,
      issues: [
        {
          title: "Design todo item",
          description:
            "Create a design for the todo item and its functionality",
          timeEstimate: "2 hours",
          done: false,
        },
        {
          title: "Implement todo item",
          description: "Create the todo item component",
          timeEstimate: "4 hours",
          done: false,
        },
      ],
    },
    {
      title: "Implement data persistence",
      description: "Handle the data persistence of the todo list items",
      done: false,
      issues: [
        {
          title: "Integrate database",
          description: "Integrate a database to store the todo list items",
          timeEstimate: "3 hours",
          done: false,
        },
        {
          title: "Write CRUD operations",
          description:
            "Write the code to Create, Read, Update, and Delete todo list items",
          timeEstimate: "3 hours",
          done: false,
        },
        {
          title: "Integrate with todo list component",
          description: "Integrate the database with the todo list component",
          timeEstimate: "2 hours",
          done: false,
        },
      ],
    },
    {
      title: "Testing and Debugging",
      description:
        "Run tests and debug to ensure that the app runs as expected",
      done: false,
      issues: [
        {
          title: "Write tests",
          description: "Write tests to verify the functionality of the app",
          timeEstimate: "2 hours",
          done: false,
        },
        {
          title: "Debug app",
          description: "Fix any issues that arise during testing",
          timeEstimate: "2 hours",
          done: false,
        },
      ],
    },
  ],
}
