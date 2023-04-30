import { createContext, useContext, useState } from "react";

export const PagamentoContext = createContext();
PagamentoContext.displayName = "Pagamento";

export const PagamentoProvider = ({ children }) => {
    const tiposPagamentos = [
        {
            nome: "Boleto",
            juros: 1,
            id: 1
        },
        {
            nome: "Cartão de crédito",
            juros: 1.2,
            id: 2
        },
        {
            nome: "Pix",
            juros: 1,
            id: 3
        },
        {
            nome: "Crediário",
            juros: 1.3,
            id: 4
        }
    ]
    const [formaPagamento, setFormaPagamento] = useState(tiposPagamentos[0]);
    return (
        <PagamentoContext.Provider value={{ tiposPagamentos, formaPagamento, setFormaPagamento }}>
            {children}
        </PagamentoContext.Provider>
    )
}

export const usePagamentoContext = () => {
    const { tiposPagamentos, formaPagamento, setFormaPagamento } = useContext(PagamentoContext);

    return { tiposPagamentos, formaPagamento, setFormaPagamento }
}