# Project Orbit

**Project Orbit** is an innovative and immersive interactive orrery that takes users on a journey through the solar system and beyond. Explore planetary systems, simulate orbital mechanics, and engage with AI-driven virtual assistants — all within a gamified, web-based environment.

## Features

- **Interactive Orrery:** Visualize the solar system and planetary movements with real-time simulations.
- **AI-Powered Virtual Assistant:** Chat with a virtual assistant via text or voice to enhance your exploration experience.
- **Gamified Spaceship Controls:** Navigate through the galaxy using intuitive spaceship controls for a more engaging experience.
- **Keplerian Orbital Propagator:** Simulates planetary motion based on real NASA datasets, providing an accurate model of celestial mechanics.

## Key Technologies

- **Web-based Orrery:** Accessible from any browser, offering seamless and interactive navigation through planetary systems.
- **AI Integration:** Incorporates text and voice interaction with an AI assistant for a unique and dynamic user experience.
- **Game-like Interface:** Spaceship controls allow for immersive exploration, making learning about the solar system fun and interactive.
- **NASA Datasets:** Utilizes real astronomical data to simulate orbital mechanics, giving users a realistic experience of planetary motion.

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, etc.)
- Internet connection
- [Cohere API Key](https://cohere.com/) (needed for AI Assistant)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/username/project-orbit-backend.git
    cd project-orbit-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and add your Cohere API key:
    ```
    COHERE_KEY=your_cohere_api_key_here
    ```

4. Start the backend server:
    ```bash
    npm start
    ```

5. The backend will be running on `http://localhost:3001`.

6. Make sure the frontend is set up to connect to `http://localhost:3001` for API calls.

## Usage

Once the project is running, you can start exploring the solar system. Use the spaceship controls to fly around different planets and moons. You can also interact with the AI assistant to learn more about celestial objects, get navigation tips, or just chat about space.

## Contributing

We welcome contributions! Feel free to submit a pull request or open an issue if you have any ideas for improvements.

## License

This project is licensed under the MIT License.

---

**Project Orbit**: A journey through the stars, guided by AI.
