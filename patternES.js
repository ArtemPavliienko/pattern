/////// modal
let BasketModul = (() => {
    let sum = 0,
        goods = [];

    return {
        addProducts( product ) {
            sum += goods.price;
            goods.push( product );
        },
        printProducts() {
            for ( let i = 0; i < goods.length; i++ ) {

            }
        },
        sumProducts() {
            return goods;
        }
    }
})();

let moto = {
    name: ['MV Agusto', 'honda'],
    price: ['17000$', '9000$']
};

BasketModul.addProducts(moto);
BasketModul.printProducts();


/////// Singleton

let Singleton = (() => {
    let ins;

    function Singleton() {
        if ( !ins ) {
            ins = this;
        } else {
            return ins;
        }
    }

    return Singleton;
})();

let s1 = new Singleton();
let s2 = new Singleton();

console.log(s1 === s2);



