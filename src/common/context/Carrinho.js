import { createContext, useContext, useEffect, useState } from 'react';
import { usePagamentoContext } from './Pagamento';
import { UsuarioContext } from './Usuario';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    const [carrinho, setCarrinho] = useState([]);
    const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);
    return (
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos, valorTotalCarrinho, setValorTotalCarrinho }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const { carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos, valorTotalCarrinho, setValorTotalCarrinho } = useContext(CarrinhoContext);
    const { formaPagamento } = usePagamentoContext();
    const { setSaldo } = useContext(UsuarioContext);
    function mudarQuantidade(id, quantidade) {
        return carrinho.map(itemDoCarrinho => {
            if (itemDoCarrinho.id === id) {
                itemDoCarrinho.quantidade += quantidade;
            }
            return itemDoCarrinho;
        })
    }
    function adicionarProduto(novoProduto) {
        const produtoJaExiste = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id)
        if (!produtoJaExiste) {
            novoProduto.quantidade = 1;
            return setCarrinho(carrinhoAnterior => [...carrinhoAnterior, novoProduto])
        } else {
            return setCarrinho(mudarQuantidade(novoProduto.id, 1))
        }
    }

    function removeProduto(idProduto) {
        const produto = carrinho.find(itemCarrinho => itemCarrinho.id === idProduto);
        const ehOUltimo = produto?.quantidade === 1;
        if (ehOUltimo) {
            return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(
                itemCarrinho => itemCarrinho.id !== idProduto
            ))
        }
        setCarrinho(mudarQuantidade(idProduto, -1))
    }

    function efetuarCompra() {
        setCarrinho([]);
        setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho)
    }

    useEffect(() => {
        const { novaQuantidade, novoTotal } = carrinho.reduce(
            (contador, itemDoCarrinho) => ({
                novaQuantidade: contador.novaQuantidade + itemDoCarrinho.quantidade,
                novoTotal: contador.novoTotal + (itemDoCarrinho.quantidade * itemDoCarrinho.valor)
            }),
            { novaQuantidade: 0, novoTotal: 0.0 }
        )
        setQuantidadeProdutos(novaQuantidade);
        setValorTotalCarrinho(novoTotal * formaPagamento.juros);
    }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento])
    return { carrinho, adicionarProduto, removeProduto, quantidadeProdutos, valorTotalCarrinho, efetuarCompra };
}