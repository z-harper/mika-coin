import { useState, useEffect } from 'react';
import Web3 from 'web3';
import MikaCoinAbi from './contracts/MikaCoin.json';
import CoinSaleAbi from './contracts/CoinSale.json';
import ProgressBar from "@ramonak/react-progress-bar";
import 'animate.css';
import MikaImg from './static/mika.PNG';

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mikaCoinContract, setMikaCoinContract] = useState({});
  const [mikaCoinTotalSupply, setMikaCoinTotalSupply] = useState();
  const [coinSaleContract, setCoinSaleContract] = useState({});
  const [coinSaleCoinsSold, setCoinSaleCoinsSold] = useState({});
  const [coinSaleCoinPrice, setCoinSaleCoinPrice] = useState({});
  const [mikaCoinToBuy, setMikaCoinToBuy] = useState();

  // Define connection with MetaMask using web3
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected.');
    }
  };

    // Interact with blockchain by importing abis
  const loadBlockChainData = async () => {
    const web3 = window.web3;

    // Get current account
    const accounts = await web3.eth.getAccounts();  
    const account = accounts[0];  
    setCurrentAccount(account);  

    // Load MikaCoin
    const mikaCoinId = await web3.eth.net.getId();
    const mikaCoinData = MikaCoinAbi.networks[mikaCoinId]; 
    if (mikaCoinData) {
      const mikaCoinContract = new web3.eth.Contract(MikaCoinAbi.abi, mikaCoinData.address);
      setMikaCoinContract(mikaCoinContract);
      const mikaCoinTotalSupply = await mikaCoinContract.methods.totalSupply().call();
      setMikaCoinTotalSupply(mikaCoinTotalSupply);
    } else {
      window.alert('MikaCoin contract not deployed to detected network.');
    }

    // Load CoinSale
    const coinSaleId = await web3.eth.net.getId();
    const coinSaleData = CoinSaleAbi.networks[coinSaleId];  
    if (coinSaleData) {
      const coinSaleContract = new web3.eth.Contract(CoinSaleAbi.abi, coinSaleData.address);
      setCoinSaleContract(coinSaleContract);
      const coinsSold = await coinSaleContract.methods.coinsSold().call();
      setCoinSaleCoinsSold(coinsSold);
      const coinPrice = await coinSaleContract.methods.coinPrice().call();
      setCoinSaleCoinPrice(coinPrice);
    } else {
      window.alert('CoinSale contract not deployed to detected network.');
    }

    // If both contracts have been loaded
    if (mikaCoinData && coinSaleData) {
      setIsLoading(false);
    }
  }

  const buyMikaCoin = async () => {
    setIsLoading(true);
    await coinSaleContract
      .methods
      .buyCoins(mikaCoinToBuy)
      .send({
        from: currentAccount,
        value: mikaCoinToBuy * coinSaleCoinPrice,
        gas: 500000 
      }) 
      .on('transactionhash', ()=>{
        console.log('sucessfully voted') 
      });
    setMikaCoinToBuy(1);
    setIsLoading(false);
  }

  const transferCoins = async () => {
    const coinSaleAddress = coinSaleContract._address;
    await mikaCoinContract.methods
      .transfer(coinSaleAddress, 750000)
      .send({
        from: currentAccount,
        gas: 500000 
      }) 
      .on('transactionhash', ()=>{
        console.log('sucessfully transferred MikaCoin') 
      });;
  }

  // loadWeb3 and loadBlockChainData should be loaded before react returns frontend
  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, [])

  if (isLoading) {
    return (
      <div className='d-flex flex-column justify-content-center align-items-center my-5'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='m-2'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='container'>
      <h1 className='text-center fw-bold text-success'>MikaCoin ICO Sale</h1>
      <hr/>
      <h3 className='text-center text-primary fw-bold animate__animated animate__bounceIn animate__delay-2s'>Introducing MikaCoin (MKC)!</h3>
      <h3 className='text-center text-secondary animate__animated animate__flash animate__delay-3s'>The better looking sibling of the coins with four legs.</h3>
      <hr/>

      <div className='row'>
        <div className='col-md mb-3'>
          <img src={MikaImg} alt='The Mika' className='img-fluid rounded mx-auto d-block animate__animated animate__backInLeft animate__slow' />
        </div>
        <div className='col-md'>
          <h5 className='text-secondary'>Ticker: <span className='text-dark fw-bold'>MKC</span></h5>
          <h5 className='text-secondary'>Token Type: <span className='text-dark fw-bold'>ERC-20</span></h5>
          <h5 className='text-secondary'>ICO Price: <span className='text-dark fw-bold'>1MKC = 0.001 ETH</span></h5>
          <h5 className='text-secondary'>Total Tokens: <span className='text-dark fw-bold'>1,000,000</span></h5>
          <h5 className='text-secondary'>Available for ICO: <span className='text-dark fw-bold'>75%</span></h5>
          <br/>
          <h5 className='text-danger'>Vision</h5>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, necessitatibus molestiae minus facilis voluptates consequatur repellat, voluptate perspiciatis nisi harum officiis optio in eveniet? Consequatur similique doloribus rerum! Omnis, mollitia.</p>
        </div>
      </div>

      <div className='text-center my-4 w-75 mx-auto'>
        <p className='p-2 border border-2 border-dark rounded bg-primary text-white'>
          <span className='fw-bold fs-5'>Notice: </span> 
          This token sale uses the Ropsten Test Network with fake ether. Use a browser extension such as MetaMask to connect and participate in the ICO.
        </p>
      </div>

      <form 
        className='mx-auto w-50' 
        onSubmit={(e) => {e.preventDefault(); buyMikaCoin() }}
      >    
        <input 
          type='number' 
          className='form-control' 
          min='1' max='750000'  
          placeholder='Amount' 
          value={mikaCoinToBuy}
          onChange={e => {setMikaCoinToBuy(e.target.value)}}
        />
        <button type='submit' className='w-100 mt-2 btn btn-primary mb-3'>Buy MikaCoin</button>
      </form>

      <ProgressBar completed={(100000 / 750000 * 100).toFixed(0)+'%'} borderRadius={'5px'} />

      <div className='row mt-3'>
        <div className='col-lg d-flex justify-content-between'>
          <h5 className='text-secondary'>ICO Coins Remaining:</h5>
          <p className='text-dark'>{(750000 - coinSaleCoinsSold).toLocaleString()}</p>
        </div>
        <div className='col-lg d-flex justify-content-between'>         
          <h5 className='text-secondary'>Your Address:</h5>
          <p className='text-dark  text-break'>{currentAccount}</p>      
        </div>
      </div>

    </div>
  );
}

export default App;
