function randoms(a) {
    let cant = a
    const array = []

    for (let index = 0; index < cant; index++) {
        const rand = Math.floor(Math.random() * (1000 - 1) + 1)
        array.push(rand)
    }
    return array
}

let a = process.argv[2]

if (a === 'NaN') {
    a = 100000000
}

process.on('message', men => {
    process.send(randoms(a))
})
