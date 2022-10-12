import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Card, Form, Alert } from 'react-bootstrap';
import '../App.css';
import wavePortal from "../utils/WavePortal.json";

const LoginScreen = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const [winner, setWinner] = useState("");
  const contractAddress = "0xB33917aC55422563bCFD6BF9f75dDcBEecacC8CE"
  const [loading, setLoading] = useState(false);
  const [totalWave, setTotalWave] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  /*
  * Create a method that gets all waves from your contract
  */

   const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider
        const signer = provider.getSigner();
         const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);
        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
        * We only need address, timestamp, and message in our UI so let's
        * pick those out
        */
         let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        /*
               * Store our data in React State
               */
        setAllWaves(wavesCleaned);
wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
         }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
     * Implement your connectWallet method here
     */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getWaveCount = async () => {
    setLoading(true);
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        setTotalWave(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }


  useEffect(() => {
    checkIfWalletIsConnected();
    getWaveCount();
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    const onYouWon = (from) => {
      console.log("YouWon", from);
      setWinner(from);
    };


    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);
      wavePortalContract.on("YouWon", onYouWon);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("YouWon", onYouWon);
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);


  const reset = async () => {
    setDone(false)
    setWinner("")
    setError("")
  }


  const wave = async () => {

    setLoading(true);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

        let count = await wavePortalContract.getTotalWaves();
        setTotalWave(count.toNumber())
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setTotalWave(count.toNumber())
        setDone(true)
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setError("Sorry! Please wait 30 seconds to wave again. If you get the same error after waiting, please reconnect your Metamask (Goerli Testnet).")

    }

    setLoading(false);
  }


  return (

    <div className="mainContainer">

      <div className="dataContainer">
        {!currentAccount && (
          <>
            <Card className="bg-primary">
              <Card.Body>
                <Card.Header> <div className="header">
                  Send me a message and wave at me!
        </div> </Card.Header>


                <Card.Text className="waveButton  text-center">
                  Connect your MetaMask to wave!



    </Card.Text>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Button className="waveButton" variant="info" onClick={connectWallet}>
                    Connect MetaMask 🦊 (Goerli)
            </Button>
                </div>



              </Card.Body>

            </Card> </>
        )}
        {currentAccount && (
          <p className="text-muted">

            ✅  Your MetaMask has been successfully connected.

    </p>
        )}

        {currentAccount && !loading && !done && !winner && !error && (

          <div>
            <Card className="bg-primary">
              <Card.Body>

                <p>
                  Thank you for visiting my site! <br />
                  I'm new to web3 technology. <br />
                  Please send me a message to  <br />
                  ・say hello 😁 <br />
                  ・wish me good luck 🤞
             <br />
                  ・comment on this site 💻
            <br />
                  etc...
             <br />
                </p>

              </Card.Body>
            </Card>


            <div className="waveButton">
              <Form>

                <Form.Group className="mb-3" >
                  <Form.Label>Please enter your message and wave at me!
    </Form.Label>
                  <Form.Control as="textarea" rows={2} value={message} onChange={(e) => { setMessage(e.target.value) }} />

                </Form.Group>
              </Form>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Button className="transparent">
                <h1 className="wave-text" onClick={wave}>
                  Click Here to Wave
        </h1></Button>

            </div>

          </div>

        )}


        {loading && (
          <div className="load-9 margin-top">
            <div className="spinner">
              <div className="bubble-1"></div>
              <div className="bubble-2"></div>
            </div>
            <p>Processing...</p>
          </div>
        )}



        {winner && (

          <div>

            <Card className="bg-primary">
              <Card.Body>
                <Card.Text className="text-center">
                  Thank you for waving!
    </Card.Text>
                <Card.Header> <div className="header">
                  You have won 0.0001 Ether!
        </div> </Card.Header>

                <Card.Text className="waveButton  text-center">
                  Address: {winner}
                </Card.Text>
              </Card.Body> </Card>

            
          </div>
        )}


        {!winner && done && (

          <div>

            <Card className="bg-primary">
              <Card.Body>
                <Card.Header> <div className="header">
                  Thank you for waving!
        </div> </Card.Header>


              </Card.Body> </Card>

          </div>
        )}



        {error && (
          <div>
            <Alert variant="warning" >
              <h2 className="text-center">{error}</h2>
            </Alert>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Button variant="info" onClick={reset}>Go Back</Button>
            </div>
          </div>
        )}
        {done && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Button variant="info" onClick={reset} className="waveButton">Go Back</Button>

          </div>
        )}

        {totalWave > 0 && (


          <div>
            <p className="waveButton text-center">The total number of waves: {totalWave}</p>
          </div>
        )}

        {allWaves
          .sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
          .map((wave, index) => {

            return (

              <Card className="margin" key={index}>
                <Card.Body >
                  <Card.Text >Address: {wave.address}
                    <br />
                    Time: {wave.timestamp.toGMTString()}
                    <br />
                    Message: {wave.message}
                  </Card.Text>
                </Card.Body>
              </Card>)
          })}





      </div>
    </div>

  )
}

export default LoginScreen

