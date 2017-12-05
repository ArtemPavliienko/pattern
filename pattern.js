// паттерн - лучшая реализация того или иного.
/////// модуль
var BasketModule = (function () {
    // сумма заказа и кол продукта
    var sum = 0,
        goods = [];

    return {
        addProduct: function ( product ) {
            sum += product.price;
            goods.push( product );
        },
        printProducts: function () {
            for (var i = 0; i < goods.length; i++) {
                console.log(
                    'Товар: ' + goods[i].name, "\n" +
                    'Цена: ' + goods[i].price
                );
            }
        },
        sumProducts: function () {
            return goods;
        }
    }
})();

var moto = {
    name: 'Kavasaki',
    price: '25000$'
};

BasketModule.addProduct(moto);
BasketModule.printProducts();


/////// Синглтон, предпологает класс с единственные экземпляром
var Singleton = (function() {
    var instance;

    function Singleton() {
        if ( !instance ) {
            instance = this;
        } else {
            return instance;
        }
    }

    return Singleton;

})();

var s1 = new Singleton();
var s2 = new Singleton();

console.log( s1 === s2);


/////// Observer -- наблюдатель
// observable - например чел решил напсать твит


function Observable() {
    var observers = [];
    this.sendMessage = function ( msg ) {
        for (var i = 0, len = observers.length; i < len; i++) {
            observers[i].notify( msg );
        }
    };
    this.addObserver = function ( observer ) {
        observers.push( observer );
    }
}

// [observer] - обозреватели, которые подписаны на observable, и сразу видят что напсал observable

function Observer( behavior ) {
    this.notify = function ( msg ) {
        behavior( msg );
    }
}

var observable = new Observable();
var obs1 = new Observer(function ( msg ) {
    console.log(msg);
});

var obs2 = new Observer(function ( msg ) {
    //console.log(msg);
});

observable.addObserver( obs1 );
observable.addObserver( obs2 );

setTimeout(function () {
    observable.sendMessage('Time ' + new Date())
}, 2000);



//////// strategy

function SortStrategy() {}
SortStrategy.prototype.sort = function () {};

function NameSS() {}
NameSS.prototype = Object.create(SortStrategy.prototype);
NameSS.prototype.sort = function (data) {
    data.sort(function (a, b) {
        return (a.name > b.name) ? 1 : -1;
    });
};

function PriceSS() {}
PriceSS.prototype = Object.create(SortStrategy.prototype);
PriceSS.prototype.sort = function (data) {
    data.sort(function (a, b) {
        return (a.price - b.price);
    });
};

function RatingSS() {}
RatingSS.prototype = Object.create(SortStrategy.prototype);
RatingSS.prototype.sort = function (data) {
    data.sort(function (a, b) {
        return (a.rating - b.rating);
    });
};


var Catalog = (function () {
    var strategy = {};
    var data = [
        {name: 'MV Agusto', price: 27000, rating: 3},
        {name: 'Kawasaki', price: 17000, rating: 4},
        {name: 'Suzuki', price: 7000, rating: 1},
        {name: 'Honda', price: 13000, rating: 5}
    ];

    function printData() {
        $('.catalog__list').empty();
        data.forEach(function (product) {
            $('.catalog__list').append(
                $('<li></li>').text(product.name + ', ' + product.price + ', ' + product.rating)
            )
        })
    }
    printData();

    return {
        sort: function () {
            strategy.sort(data);
            printData();
        },
        setStrategy: function (s) {
            strategy = s;
        }
    }
})();


$('.catalog__sort').change(function () {
    var val = $(this).val();
    console.log(val, '5');

    if (val === 'name') Catalog.setStrategy(new NameSS());
    else if (val === 'price') Catalog.setStrategy(new PriceSS());
    else if (val === 'rating') Catalog.setStrategy(new RatingSS());
});

$('.catalog__exec-sort').click(function () {
    Catalog.sort();
});





/////// Decorator (обертка)

function A() {
    this.get = function () {
        console.log('ich class A!');
    }
}

function Decorator(obj) {
    this._obj = obj;
}
Decorator.prototype = Object.create(A.prototype);
Decorator.prototype.constructor = Decorator;

function DecoratorB(obj) {
    Decorator.call(this, obj);
    this.get = function() {
        this._obj.get();
        console.log('kawa!');
    }
}
DecoratorB.prototype = Object.create(Decorator.prototype);
DecoratorB.prototype.constructor = DecoratorB;

function DecoratorC(obj) {
    Decorator.call(this, obj);
    this.get = function() {
        this._obj.get();
        console.log('mv!');
    }
}
DecoratorC.prototype = Object.create(Decorator.prototype);
DecoratorC.prototype.constructor = DecoratorC;


var obj1 = new A(),
    obj2 = new DecoratorB(new A()),
    obj3 = new DecoratorC(new A()),
    obj4 = new DecoratorB(new DecoratorC(new A()));

obj1.get();
console.log('///////'); //ich class A!
obj2.get();
console.log('///////'); // ich class A! => kawa!
obj3.get();
console.log('///////'); // ich class A => mv!
obj4.get();
console.log('///////'); // ich class A => mv! => kawa!


// Praktika
function Input(labeltext) {
    var $element = $('<div></div>')
        .addClass('input')
        .append(
           $('<span></span>').addClass('input__label')
               .text(labeltext),
            $('<input>').addClass('input__field')
        );
    this.get = function () {
        return $element;
    }
}

function Decorator2(obj) {
    this._obj = obj;
    this.get = function () {
        return this._obj.get();
    }
}
Decorator.prototype = Object.create(Input.prototype);
Decorator.prototype.constructor = Decorator2;

function ClearDecorator(obj) {
    Decorator2.call(this, obj);

    this._obj.get().append(
       $('<span>x</span>').addClass('input__clear')
    );
    $(document.body).on('click', '.input__clear', function (e) {
        $(e.target).siblings('.input__field').val('');
    });

    this.get = function() {
        return this._obj.get();
    }
}
ClearDecorator.prototype = Object.create(Decorator2.prototype);
ClearDecorator.prototype.constructor = ClearDecorator;

function ValidateDecorator(obj) {
    Decorator2.call(this, obj);

    this._obj.get().children('.input__field').attr('data-valid', '');

    $(document.body).on('input', '.input__field[data-valid]', function (e) {
        if ( /[0-9]/.test( $(e.target).val() )) {
            $(e.target).parent().addClass('input_wrong');
        } else {
            $(e.target).parent().removeClass('input_wrong');
        }

    });

    this.get = function() {
        return this._obj.get();
    }
}
ValidateDecorator.prototype = Object.create(Decorator2.prototype);
ValidateDecorator.prototype.constructor = ValidateDecorator;


var i = new Input('Простой'),
    iClear = new ClearDecorator(new Input('очищаем')),
    iValid = new ValidateDecorator(new Input('проверяем валидацию')),
    iBoth = new ValidateDecorator(new ClearDecorator(new Input('Совмещенный')));

$(document.body).append( i.get(), iClear.get(), iValid.get(), iBoth.get() );


////////////////////////////////////



