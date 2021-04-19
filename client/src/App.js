import { useState, useEffect } from 'react';
import Web3 from 'web3';
import CoinSaleAbi from './contracts/CoinSale.json';
import 'animate.css';
import MikaImg from './static/mika.PNG';

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

    const accounts = await web3.eth.getAccounts();  // get accounts
    const account = accounts[0];  // current account
    setCurrentAccount(account);  // set current account so it can be displayed

    // get network id 
    const networkId = await web3.eth.net.getId();
    console.log(networkId);

    // use networkId to get the network data (at bottom of Election json file)
    const networkData = CoinSaleAbi.networks[networkId];  
    console.log(networkData);

    // // define smart contract so we can interact with it
    // if (networkData) {
    //   // takes 2 params. 1- abi associated with contract. 2- address of smart contract
    //   // creates a new contract instance with all its methods and events defined in its json interface object
    //   const election = new web3.eth.Contract(Electionabi.abi, networkData.address);
    //   //console.log('election contract', election);

    //   // get candidates data
    //   // this is how we call a method on smart contract
    //   // candidate object has a property methods which contains functions we can call
    //   const candidate1 = await election.methods.Candidates(1).call();
    //   const candidate2 = await election.methods.Candidates(2).call();
    //   //console.log(candidate1, candidate2);
    //   setCand1(candidate1);
    //   setCand2(candidate2);
    //   setElectionContract(election);  // allows us to interact with election contract
    //   setIsLoading(false);
    // } else {
    //   window.alert('smart contract is not deployed to current network');
    // }

    setIsLoading(false);
  }

  // loadWeb3 and loadBlockChainData should be loaded before react returns frontend
  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, [])

  if (isLoading) {
    return <p>loading...</p>
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

      <form className='mx-auto w-50'>    
        <input type='number' className='form-control' min='1' max='750000'  placeholder='Amount' />
        <button type='submit' className='w-100 mt-2 btn btn-primary mb-3'>Buy MikaCoin</button>
      </form>

      <div className='progress mb-3'>
        <div className='progress-bar progress-bar-striped w-50' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>
      </div>

      <div className='row'>
        <div className='col-lg d-flex justify-content-between'>
          <h5 className='text-secondary'>ICO Coins Remaining:</h5>
          <p className='text-dark'>750,000</p>
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
