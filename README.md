
# ⚡ Appliance Energy Usage Calculator

This project is a **Node.js-based toolset** for analyzing appliance energy usage from event logs. It is modular, testable, and built to handle edge cases—ensuring reliable computation of usage and savings.

---

## 📌 Project Purpose

The goal of this project is to:

- Calculate daily energy usage for appliances based on timestamped `on/off` events.
- Track energy savings from smart features (e.g., `auto-off`).
- Support multi-day usage analysis using precise, reusable logic.
- Handle invalid, messy, or out-of-order data robustly.

---

## 🗂️ Folder Structure

```
├── services/                    # Core logic for energy calculations
│   ├── calculateEnergySavings.js
│   ├── calculateEnergyUsageForDay.js
│   ├── calculateEnergyUsageSimple.js
│   └── index.js                # Barrel export for services
│
├── utils/                       # Shared constants and sanitization logic
│   ├── constants.js
│   ├── sanitizeEvents.js
│   └── index.js                # Barrel export for utils
│
├── tests/                       # All test cases using Jest
│   ├── services/
│   │   ├── calculateEnergySavings.test.js
│   │   ├── calculateEnergyUsageForDay.test.js
│   │   └── calculateEnergyUsageSimple.test.js
│   └── utils/
│       └── sanitizeEvents.test.js
│
├── .gitignore
├── .prettierrc
├── package.json
├── yarn.lock / package-lock.json
└── README.md                   # You're here!
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/subedijames2017/appliance-energy-usage.git
cd appliance-energy-usage
```

### 2. Install dependencies

Using **Yarn**:

```bash
yarn install
```

Or using **npm**:

```bash
npm install
```

---

## 🧪 Running Tests

To run all unit tests:

Using **npm**:

```bash
npm test
```

Using **Yarn**:

```bash
yarn test
```

Test coverage includes:

- 🟢 Valid usage profiles  
- 🔁 Duplicate and out-of-order events  
- ❌ Invalid or missing data  
- ⏱ Auto-off logic and edge cases  
- 📆 Multi-day profile slicing  

---

## 📥 Example Input/Output

```js
const profile = {
  initial: 'on',
  events: [
    { timestamp: 100, state: 'off' },
    { timestamp: 200, state: 'on' },
    { timestamp: 500, state: 'auto-off' },
    { timestamp: 700, state: 'on' },
  ],
};

calculateEnergyUsageSimple(profile);      // ➜ Total minutes the appliance was 'on'
calculateEnergySavings(profile);          // ➜ Total minutes saved by 'auto-off'
calculateEnergyUsageForDay(profile, 1);   // ➜ Energy usage for Day 1
```

---

## ✅ Requirements

- [Node.js](https://nodejs.org/) v14 or newer
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

---

## ✨ Notes

- Designed with test-driven development in mind.
- Follows single responsibility principle and modular design.
- Easy to integrate with additional input/output interfaces in the future.

---

Happy coding! ⚙️🔌
