import { createContext, useContext, useEffect, useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    const [carrinho, setCarrinho] = useState([]);
    return (
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const { carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos } = useContext(CarrinhoContext);

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

    useEffect(() => {
        const novaQuantidadeProdutos = carrinho.reduce((contador, itemDoCarrinho) => contador + itemDoCarrinho.quantidade, 0)
        setQuantidadeProdutos(novaQuantidadeProdutos);
    }, [carrinho, setQuantidadeProdutos])
    return { carrinho, adicionarProduto, removeProduto , quantidadeProdutos};
}