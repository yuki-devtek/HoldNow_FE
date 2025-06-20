'use client';

import UserContext from '@/context/UserContext';
import { getTokenBalance, swapTx } from '@/program/web3';
import { coinInfo } from '@/utils/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { errorAlert } from '../others/ToastGroup';
import { useClaim } from '@/context/ClaimContext';
import { claim } from '@/utils/util';


interface TradingFormProps {
  coin: coinInfo;
  progress: Number;
}

export const TradeForm: React.FC<TradingFormProps> = ({ coin, progress }) => {
  const [amount, setSol] = useState<string>('');
  const [isSell, setIsBuy] = useState<number>(0);
  const [tokenBal, setTokenBal] = useState<number>(0);
  const [tokenName, setTokenName] = useState<string>('Token');
  const [canTrade, setCanTrade] = useState<boolean>(false);
  const { user, setWeb3Tx } = useContext(UserContext);
  
  const { claimAmount } = useClaim();
  
  const wallet = useWallet();
  const SolList = [
    { id: 0, price: 'reset' },
    { id: '1', price: '1 sol' },
    { id: '5', price: '5 sol' },
    { id: '10', price: '10 sol' },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(parseFloat(value))) {
      setSol(value);
    } else if (value === '') {
      setSol(''); // Allow empty string to clear the input
    }
  };

  const getBalance = async () => {
    try {
      const balance = await getTokenBalance(user.wallet, coin.token);
      setTokenBal(balance ? balance : 0);
    } catch (error) {
      setTokenBal(0);
    }
  };
  getBalance();

  const handlTrade = async () => {
    if (!!!amount) {
      errorAlert('Please set Amount');
      return;
    }
    const mint = new PublicKey(coin.token);
    const userWallet = new PublicKey(user.wallet);
    if (isSell == 0) {
      const totalLiquidity = coin.tokenReserves * coin.lamportReserves;
      const tokenAmount =
        coin.tokenReserves -
        totalLiquidity /
          (coin.lamportReserves + parseFloat(amount) * Math.pow(10, 9));
      const res = await swapTx(mint, wallet, tokenAmount, isSell, tokenAmount);
      // if (res) {
      //   setTimeout(async () => {
      //     window.location.reload();
      //   }, 500);
      // }
    } else {
      const totalLiquidity = coin.tokenReserves * coin.lamportReserves;
      const minSol =
        coin.lamportReserves -
        totalLiquidity /
          (coin.tokenReserves + parseFloat(amount) * Math.pow(10, 6));
      const res = await swapTx(
        mint,
        wallet,
        parseFloat(amount),
        isSell,
        minSol,
        0, // claimAmount[2],
      );
      // if (res) {
      //   setTimeout(async () => {
      //     window.location.reload();
      //   }, 500);
      // }
    }
  };

  useEffect(() => {
    if (coin.name !== '' && coin.name !== undefined && coin.name !== null)
      setTokenName(coin.name);
  }, [coin]);

  useEffect(() => {
    if (coin.airdropStage === false) {
      setCanTrade(true);
    } else {
      setCanTrade(false);
    }
  }, [coin.airdropStage]);

  return (
    <div className="p-3 rounded-lg bg-transparent border-[1px] border-[#64ffda] text-white font-semibold">
      <div className="flex flex-row justify-center px-3 py-2">
        <button
          className={`rounded-l-lg py-3 w-full ${isSell === 0 ? 'bg-custom-gradient' : 'bg-slate-800 hover:bg-slate-300'}`}
          onClick={() => setIsBuy(0)}
        >
          {' '}
          Buy
        </button>
        <button
          className={`rounded-r-lg py-3 w-full ${isSell === 1 ? 'bg-custom-gradient' : 'bg-slate-800 hover:bg-slate-300'}`}
          onClick={() => setIsBuy(1)}
        >
          Sell
        </button>
      </div>
      <div className="xs:px-4 flex flex-col relative">
        <div
          onClick={() => console.log('set max')}
          className="rounded bg-transparent text-center w-[200px] p-2 block mb-2 text-ml font-medium text-white dark:text-white mx-auto border-[1px] border-[#64ffda] hover:bg-[#64ffda]/30 cursor-pointer"
        >
          Set max slippage
        </div>
        <div className="w-full flex flex-row items-center bg-transparent rounded-lg">
          <input
            type="number"
            id="setTrade"
            value={amount}
            onChange={handleInputChange}
            pattern="\d*"
            className="w-full outline-none text-black p-2.5 capitalize rounded-l-lg"
            placeholder="0.0"
            required
          />
          <div className="flex flex-col text-center p-2.5 border-l-[1px] border-l-[#64ffda] bg-custom-gradient rounded-r-md">
            {isSell === 0 ? 'SOL' : 'Token'}
          </div>
        </div>
        {isSell === 0 ? (
          <div className="flex flex-col xs:flex-row py-2 gap-3 text-center mx-auto xs:mx-0">
            {SolList.map((item: any, index: any) => {
              return (
                <div
                  key={item.id}
                  className="max-w-[100px] rounded-lg px-2 py-1 border-[1px] border-[#64ffda] hover:bg-[#64ffda]/30 cursor-pointer"
                  onClick={() => setSol(item.id)}
                >
                  {item.price}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col xs:flex-row py-2 gap-3 text-center mx-auto xs:mx-0">
            <button
              className="max-w-[100px] rounded-lg px-2 py-1 border-[1px] border-[#64ffda] hover:bg-[#64ffda]/30 cursor-pointer"
              onClick={() => setSol('')}
            >
              reset
            </button>
            <button
              disabled={tokenBal && tokenBal !== 0 ? false : true}
              className={`${tokenBal && tokenBal !== 0 ? 'cursor-pointer hover:bg-[#64ffda]/30' : 'cursor-not-allowed'} max-w-[100px] rounded-lg px-2 py-1 border-[1px] border-[#64ffda] `}
              onClick={() => setSol((tokenBal / 10).toString())}
            >
              10%
            </button>
            <button
              disabled={tokenBal && tokenBal !== 0 ? false : true}
              className={`${tokenBal && tokenBal !== 0 ? 'cursor-pointer hover:bg-[#64ffda]/30' : 'cursor-not-allowed'} max-w-[100px] rounded-lg px-2 py-1 border-[1px] border-[#64ffda]`}
              onClick={() => setSol((tokenBal / 4).toString())}
            >
              25%
            </button>
            <button
              disabled={tokenBal && tokenBal !== 0 ? false : true}
              className={`${tokenBal && tokenBal !== 0 ? 'cursor-pointer hover:bg-[#64ffda]/30' : 'cursor-not-allowed'}max-w-[100px] rounded-lg px-2 py-1 border-[1px] border-[#64ffda]`}
              onClick={() => setSol((tokenBal / 2).toString())}
            >
              50%
            </button>
            <button
              disabled={tokenBal && tokenBal !== 0 ? false : true}
              className={`${tokenBal && tokenBal !== 0 ? 'cursor-pointer hover:bg-[#64ffda]/30' : 'cursor-not-allowed'}max-w-[100px] rounded-lg px-2 py-1 border-[1px] border-[#64ffda]`}
              onClick={() => setSol(tokenBal.toString())}
            >
              100%
            </button>
          </div>
        )}

        {coin.airdropStage ? (
          <></>
        ) : (
          <div
            className="border-[1px] border-[#64ffda] cursor-pointer hover:bg-[#64ffda]/30 w-full text-center rounded-lg py-2"
            onClick={handlTrade}
          >
            Place Trade
          </div>
        )}
      </div>
    </div>
  );
};