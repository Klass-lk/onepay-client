# OnePay Client

[![GitHub Pages Deployment](https://github.com/klass-lk/onepay-client/actions/workflows/nextjs.yml/badge.svg)](https://github.com/klass-lk/onepay-client/actions/workflows/deploy.yml)

This repository contains the source code for a website that simplifies the process of requesting and validating payment links using the [OnePay.lk](https://www.onepay.lk/) payment API.

The website is available at: [https://klass-lk.github.io/onepay-client](https://klass-lk.github.io/onepay-client).

## Features

- **SHA256 Hash Validation**: Validate the SHA256 hash required to send with API requests to OnePay.
- **Request Payment Link**: Send payment link requests directly via the website and view the API response.

## Website Usage

1. **SHA256 Hash Validation**:
    - Input the necessary parameters for the OnePay API request.
    - The website generates and validates the SHA256 hash to ensure accuracy.

2. **Send Payment Request**:
    - Use the website to submit payment link requests to the OnePay API.
    - View the response directly in the interface.

## Tech Stack

- NextJS
- GitHub Pages for deployment

## How to Contribute

Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.

### Development

To get started with local development:

1. Clone the repository:
    ```bash
    git clone https://github.com/klass-lk/onepay-client.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000`.

### Deployment

This project is deployed using GitHub Pages. The deployment workflow is handled automatically via GitHub Actions.

---

**Website**: [https://klass-lk.github.io/onepay-client](https://klass-lk.github.io/onepay-client)  
**OnePay API**: [https://www.onepay.lk/](https://www.onepay.lk/)

