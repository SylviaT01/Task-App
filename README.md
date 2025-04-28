# Task Management Application (Angular)

## Project Overview

This is a Task Management Application built using Angular. The application allows users to manage their tasks efficiently by providing features such as task listing, filtering, adding, editing, and state management.

### Features

- Display a list of tasks fetched from a mock API.
- Filter tasks by completion status (Completed / Not Completed).
- Delete tasks from the list.
- Mark tasks as complete or incomplete.
- Add and edit tasks using a reactive form with validation.
- Real-time notification of the number of incomplete tasks using state management.
- Responsive and visually appealing UI using Angular Material or Bootstrap.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Angular CLI installed globally (optional but recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:SylviaT01/Task-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd task-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server with:

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

## Project Structure

- `src/app/pages/task-list/` - Task list component with filtering and actions.
- `src/app/pages/task-form/` - Task add/edit form with validation.
- `src/app/services/task.service.ts` - Service for managing task data and state.
- `src/app/services/notification.service.ts` - Service for managing notifications.


## Additional Resources

For more information on Angular CLI and development, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

---

## Angular CLI Default Commands

### Development server

To start a local development server, run:

```bash
ng serve
```

### Code scaffolding

Generate a new component:

```bash
ng generate component component-name
```

## Contributions
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## Author
[Sylvia Chebet](https://github.com/SylviaT01)

## License
This project is licensed under the MIT License.

