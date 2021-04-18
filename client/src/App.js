
import 'animate.css';
import MikaImg from './static/mika.PNG';

function App() {
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
          This token sale uses the Kovan Test Network with fake ether. Use a browser extension such as MetaMask to connect and participate in the ICO.
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
          <p className='text-dark'>0x234523wdfgsd5e2wgw</p>
        </div>
      </div>

    </div>
  );
}

export default App;
