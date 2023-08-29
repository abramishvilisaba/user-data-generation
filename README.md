# Fake User Data Generation

This project is a web application that allows users to generate and view fake user data with the ability to introduce data entry errors for testing and simulation purposes. The application supports selecting regions, specifying error rates per record, defining seed values, and generating random seeds. It's designed to generate random user data that looks realistic based on the chosen region.

## Features

- **Region Selection**: Users can select a region from a list of available options, such as Georgia, USA,  and more. The generated user data will be tailored to the selected region's language and conventions.

- **Error Simulation**: Users can specify the number of errors per record using a slider (0 to 10) or a numerical input field (0 to 1000). Errors can be deletion, insertion, or swapping of characters within the generated data. The application introduces errors to emulate data entry mistakes.

- **Seed Value and Random Seed Generation**: Users can specify a seed value or generate a random seed for the random number generator (RNG). Changing the seed value regenerates the data, ensuring that the same seed produces the same data across different sessions.

- **Infinite Scrolling Table**: The application displays a table with 20 records initially. When users scroll down, the application loads the next batch of 10 records using infinite scrolling, providing a seamless user experience.

- **Realistic Data Generation**: The user data is generated based on region-specific lookup tables for names, surnames, cities, etc. This approach ensures that the data corresponds to the chosen region and appears realistic.

## How to Use

1. Open the web application in your browser.
2. Select a region from the provided options.
3. Specify the number of errors per record using the slider or numerical input field.
4. Optionally enter a seed value or generate a random seed.
5. Scroll down to view additional records as needed.
6. Enjoy exploring the generated fake user data!

## Technical Details

- The application is built using **React** for the user interface and user interactions.
- **Infinite scrolling** is implemented to load additional records as users scroll down.
- Data generation is based on region-specific lookup tables for names, surnames, cities, etc using fakerJs
- Errors are introduced using the specified error rate and type, ensuring that data remains realistic.

## Disclaimer

This application is for educational and testing purposes only. The generated data is entirely fake and does not represent real individuals. The error simulation feature is intended to emulate data entry errors for testing and does not reflect actual data quality issues.

## Project Setup

1. Clone this repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Run the application using `npm start`.

## Links

- GitHub Repository: [github.com/abramishvilisaba/user-data-generation](https://github.com/abramishvilisaba/user-data-generation)
- Live Demo: [sabramishvili-fake-data-generation.netlify.app](https://sabramishvili-fake-data-generation.netlify.app/)

## Author

- GitHub: [abramishvilisaba](https://github.com/abramishvilisaba/user-data-generation))

## Contributing

Contributions to this project are welcome! If you find a bug or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code for your purposes.

