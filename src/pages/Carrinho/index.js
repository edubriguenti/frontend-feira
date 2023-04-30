import { Button, Snackbar, InputLabel, Select, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useContext, useMemo, useState } from 'react';
import { Container, Voltar, TotalContainer, PagamentoContainer } from './styles';
import { useCarrinhoContext } from 'common/context/Carrinho';
import Produto from 'components/Produto';
import { useHistory } from 'react-router-dom';
import { usePagamentoContext } from 'common/context/Pagamento';
import { UsuarioContext } from 'common/context/Usuario';

function Carrinho() {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const { carrinho, valorTotalCarrinho, efetuarCompra } = useCarrinhoContext()
  const { saldo = 0 } = useContext(UsuarioContext)
  const { formaPagamento, tiposPagamentos, mudarFormaPagamento } = usePagamentoContext()
  const history = useHistory()
  const total = useMemo(() => saldo - valorTotalCarrinho, [saldo, valorTotalCarrinho]);
  return (
    <Container>
      <Voltar onClick={() => history.goBack()} />
      <h2>
        Carrinho
      </h2>
      {carrinho.map(
        produto => (
          <Produto
            {...produto}
            key={produto.id}
          />
        )
      )}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select onChange={(event) => mudarFormaPagamento(event.target.value)} value={formaPagamento.id}>
          {tiposPagamentos.map(item =>
          (
            <MenuItem value={item.id} key={item.id}>
              {item.nome}
            </MenuItem>
          )
          )}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
        <div>
          <h2>Total no Carrinho: </h2>
          <span>R$ {valorTotalCarrinho.toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo: </h2>
          <span> R$ {saldo.toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo Total: </h2>
          <span> R$ {total.toFixed(2)}</span>
        </div>
      </TotalContainer>
      <Button
        onClick={() => {
          efetuarCompra()
          setOpenSnackbar(true);
        }}
        color="primary"
        variant="contained"
        disabled={total < 0 || valorTotalCarrinho === 0}
      >
        Comprar
      </Button>
      <Snackbar
        anchorOrigin={
          {
            vertical: 'top',
            horizontal: 'right'
          }
        }
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
        >
          Compra feita com sucesso!
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default Carrinho;