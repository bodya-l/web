/** @type {import('tailwindcss').Config} */
module.exports = {
    // ❗️❗️❗️ ОСЬ ВИПРАВЛЕННЯ: ❗️❗️❗️
    darkMode: 'class',

    content: [
        // Вказуємо Tailwind шукати класи у всіх файлах JS, JSX, TS, TSX, що знаходяться
        // у папках 'app' та 'components', а також у кореневих файлах.
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}