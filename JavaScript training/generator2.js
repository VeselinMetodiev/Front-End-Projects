const myIterable = (from = 0, to = 10, step = 1) => ({
    *[Symbol.iterator]() { //No star, no yield, i.e generator function
        for(let i = from; i < to; i += step) {
            yield i; // <> return value from iterator next()
        }
    }
})

for(const e of myIterable()){
    console.log(e);
}
for(const e of myIterable(10, 100, 10)){
    console.log(e);
}
