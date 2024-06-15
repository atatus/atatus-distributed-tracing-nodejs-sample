// Application urls
const CUSTOMER_SERVICE_URL = 'http://localhost:8081/customer'
const PAYMENT_SERVICE_URL = 'http://localhost:8080/payment'
const ORDER_SERVICE_URL = 'http://localhost:8082/order'
// Components
const Title = (props) => <p>{props.label}</p>
const Response = (props) => <pre>{JSON.stringify(props.result, null, 4)}</pre>
const ProductDD = (props) => {
  return (
    <select onChange={props.handleProductChange}>
      <option selected>What's On Your Mind..? Choose Your Favourite Dish</option>
      <option value={200}>Briyani</option>
      <option value={350}>Pizza</option>
      <option value={80}>Cake</option>
      <option value={120}>Pure Veg</option>
      <option value={50}>Ice Cream</option>
      <option value={200}>Burger</option>
      <option value={150}>Rolls</option>
      <option value={200}>Noodles</option>
      <option value={120}>Pasta</option>
    </select>
  )
}

const App = () => {
  let [customer, setCustomer] = React.useState()
  let [payment, setPayment] = React.useState()
  let [order, setOrder] = React.useState()
  let [product, setProduct] = React.useState()
  let createCustomer = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CUSTOMER_NAME: 'Abishek',
          ACCOUNT: 'ABCDE1234F',
        }),
      }
      let response = await fetch(`${CUSTOMER_SERVICE_URL}/create`, requestOptions)
      let result = await response.json()
      setCustomer(result)
      console.log(result)
    } catch (error) {
      setCustomer(error.message)
      console.log('err', error.message)
    }
  }

  let handleProduct = (e) => {
    let { options, value } = e.target
    setProduct({
      PRODUCT_NAME: options[options.selectedIndex].text,
      PRICE: String(value),
    })
  }
  let transferFund = async () => {
    console.log('transferFund', customer)
    const requestOptions = {
      method: 'GET',
    }
    let response = await fetch(
      `${PAYMENT_SERVICE_URL}/transfer/id/${customer.ID}?amount=10000`,
      requestOptions
    )
    let result = await response.json()
    setPayment(result)
    console.log(result)
  }

  let placeOrder = async () => {
    console.log('placeOrder', product)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CUSTOMER_ID: customer.ID,
        PRODUCT_NAME: product.PRODUCT_NAME,
        PRICE: product.PRICE,
      }),
    }
    let response = await fetch(`${ORDER_SERVICE_URL}/create`, requestOptions)
    let result = await response.json()
    setOrder(result)
    console.log(result)
  }
  let handleReset = () => {
    setCustomer()
    setPayment()
    setOrder()
    setProduct()
  }

  const divStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  };

  const highlightHeader = {
    fontWeight: '10',
    fontStyle: 'Monospace',
    fontSize: '28px',
    marginBottom: '50px'
  };

  const resetStyle = {
    marginTop: '50px',
    marginLeft: '12px',
  };

  const highlightButton = {
    backgroundColor: 'blue',
    color: 'white',
    fontWeight: 'bold',
    border: '2px solid black',
    padding: '10px', 
    borderRadius: '5px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
  };

  const highlightedJSON = {
      backgroundColor: '#f4f4f4',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
      overflowX: 'auto',
      fontFamily: 'monospace',
      fontSize: '14px',
      marginBottom: '10px',
      marginTop: '20px',
  };

  return (
    <div style={divStyle}>
      <div>
        <h1 style={highlightHeader}>Atatus Micro Service Demo Application</h1>
        <Title label="1.Customer Creation"></Title>
        <button onClick={createCustomer} style={highlightButton}>Create Customer</button>
          <div style={highlightedJSON}>
            <Response result={customer}/>
          </div>
        {customer && (
          <div>
            <Title label="2.Transfer amount"></Title>
            <button onClick={transferFund} style={highlightButton}>Transfer Fund</button>
            <div style={highlightedJSON}>
              <Response result={payment}/>
            </div>
          </div>
        )}
        {payment && (
          <div>
            <Title label="3.Place order"></Title>
            <ProductDD handleProductChange={handleProduct} />
            {product && <button onClick={placeOrder} style={highlightButton}>Place Order</button>}
            {order && (
              <div>
                <div style={highlightedJSON}>
                  <Response result={order} />
                </div>
                <h3 style={highlightHeader}>Enjoy ... Order Confirmed!</h3>
              </div>
            )}
          </div>
        )}
        <div style={resetStyle}>
          <button onClick={handleReset} style={highlightButton}>Refresh</button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
