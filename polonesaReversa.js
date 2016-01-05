(function() {
    'use strict';

    var link = function(scope, element, attrs) {
        var vm = this;
        var expressao = '';
        var hashMap = [];
        var simplificada = "";
        var posFixada = "";
        var resultado = 0;

        var clear = function() {
            expressao = '';
            hashMap = [];
            simplificada = "";
            posFixada = "";
            resultado = 0;
        };

        var obterPrioridade = function(operador) {
            switch (operador) {
                case '(':
                    return 1;
                case '+':
                case '-':
                    return 2;
                case '*':
                case '/':
                    return 3;
                case '^':
                case '%':
                    return 4;
                default:
                    return 0;
            }
        };

        var eOperando = function(dado) {
            return (dado >= 'A' && dado <= 'Z');
        };

        var eOperador = function(dado) {
            return (['+', '-', '*', '/', '^', '%']).indexOf(dado) !== -1
        };

        var criaHash = function() {
            var variavel = 'A';
            var saida = '';
            var tmp = expressao.split('');
            var i = 0;
            var size = tmp.length;

            for (i = 0; i <= size; i++) {
                if (!isNaN(tmp[i]) || tmp[i] === '.') {
                    saida += tmp[i];
                } else if (saida !== '') {
                    hashMap.push({
                        key: variavel,
                        valor: saida
                    });
                    saida = '';
                    variavel = String.fromCharCode(variavel.charCodeAt(0) + 1);
                }
            }
        };

        var pegaValorDoHash = function(variavel) {
            var saida = 0;
            var i = 0;
            var size = hashMap.length;
            for (i = 0; i < size; i++) {
                if (variavel === hashMap[i].key) {
                    return hashMap[i].valor;
                }
            }
            return 0;
        };

        var simplificaExpressao = function() {
            var saida = '';
            var flag = false;
            var variavel = 'A';
            var tmp = expressao.split('');

            var i = 0;
            var size = tmp.length;

            var aux = '';
            for (i = 0; i < size; i++) {
                aux = tmp[i];
                if (isNaN(aux) && aux != '.') {
                    saida += aux;
                    flag = false;
                } else {
                    if (flag === false) {
                        saida += variavel;
                        variavel = String.fromCharCode(variavel.charCodeAt(0) + 1);
                    }
                    flag = true;
                }
            }
            simplificada = saida;
        };

        var converterParaPosFixa = function() {
            var m = this;
            var lista = [];
            var saida = '';
            var tmpPrioridade = 0;
            var tmp = simplificada.split('');

            var i = 0;
            var size = tmp.length;

            var valor = '';

            for (i = 0; i < size; i++) {
                valor = tmp[i];
                if (eOperando(valor)) {
                    saida += valor;
                } else if (eOperador(valor)) {
                    tmpPrioridade = obterPrioridade(valor);
                    while ((lista.length != 0) && (lista[lista.length - 1].prioridade >= tmpPrioridade)) {
                        saida += lista[lista.length - 1].val;
                        lista.pop();
                    }
                    lista.push({
                        prioridade: tmpPrioridade,
                        val: valor
                    });
                } else if ('(' === valor) {
                    lista.push({
                        prioridade: tmpPrioridade,
                        val: valor
                    });
                } else if (')' === valor) {
                    var item = lista.pop();
                    while (item.val != '(') {
                        saida += item.val;
                        item = lista.pop();
                    }
                }
            }
            while (lista.length > 0) {
                saida += lista.pop().val;
            }
            posFixada = saida;
        };

        var resolverExpressao = function() {
            var lista = [];
            var tmp = posFixada.split('');
            var i = 0;
            var size = tmp.length;
            var aux = '';
            for (i = 0; i < size; i++) {
                aux = tmp[i];
                if (eOperando(aux)) {
                    lista.push(pegaValorDoHash(aux));
                } else {
                    if (eOperador(aux)) {
                        var x = Number(lista.pop());
                        var y = Number(lista.pop());
                        switch (aux) {
                            case '+':
                                lista.push(x + y);
                                break;
                            case '-':
                                lista.push(x - y);
                                break;
                            case '*':
                                lista.push(x * y);
                            case '/':
                                lista.push(y / x);
                                break;
                            case '^':
                                lista.push(Math.pow(x, y));
                                break;
                            case '%':
                                lista.push((x / 100) * y);
                                break;
                        }
                    }
                }
            }
            resultado = lista.pop();
        };

        element.bind('keydown', function(e) {
            if (e.keyCode === 13) {
                expressao = e.target.value;
                criaHash();
                simplificaExpressao();
                converterParaPosFixa();
                resolverExpressao();
                e.target.value = resultado;
                clear();
            }
        });
    };

    var diretiva = function() {
        return {
            restrict: 'A',
            link: link
        };
    };

    angular.module('polonesaReversa', [])
        .directive('polonesaReversa', diretiva);

}());