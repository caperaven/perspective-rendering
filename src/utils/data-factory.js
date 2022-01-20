/**
 * columns
 * id, code, description, number, duration, date, externalCode
 */

const externalCodes = [
    await getRandomCode(),
    await getRandomCode(),
    await getRandomCode(),
    await getRandomCode(),
    await getRandomCode(),
]

export async function createDate(count) {
    let result = [];

    for (let i = 0; i < count; i++) {
        const id            = i;
        const code          = await getRandomCode();
        const description   = `Description for id: ${i}`;
        const number        = await getRandomNumber();
        const date          = await getRandomDate();
        const duration      = await getRandomDuration();
        const externalCode  = await getRandomExternalCode();

        result.push({
            id              : id,
            code            : code,
            description     : description,
            number          : number,
            date            : date,
            duration        : duration,
            externalCode    : externalCode
        })
    }

    return result;
}

async function getRandomCode() {
    let results = [];

    for (let i = 0; i < 6; i++) {
        const int = await crs.intent.random.integer({ args: {
            min: 33,
            max: 122
        }})

        results.push(int);
    }

    return String.fromCharCode(...results);
}

async function getRandomNumber(min, max) {
    return await crs.intent.random.integer({ args: {
            min: min,
            max: max
        }})
}

async function getRandomExternalCode() {
    let index = await getRandomNumber(0, 4);
    return externalCodes[index];
}

async function getRandomDate() {
    const year = await getRandomNumber(1990, 2022);
    const month = await getRandomNumber(1, 12);
    const day = await getRandomNumber(1, 29);

    return `${year}:${month}:${day} 00:00:00`;
}

async function getRandomDuration() {
    const hours = await getRandomNumber(0, 23);
    const min = await getRandomNumber(0, 59);
    const seconds = await getRandomNumber(0, 59);

    return `PT${hours}H${min}M${seconds}S`;
}