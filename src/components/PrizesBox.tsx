import { useState } from "react";
import { IPrize } from "../App";

interface IProps {
  prizes: IPrize[];
  setPrizes: () => React.Dispatch<React.SetStateAction<IPrize[]>>;
  selectedPrize: number;
  setSelectedPrize: (i: number) => void;
  setAddPrizeOverlay: (i: boolean) => void;
}

export const PrizesBox: React.FC<IProps> = ({ prizes, selectedPrize, setSelectedPrize, setAddPrizeOverlay }) => {
  return (
    <div className="h-96 w-3/4 text-center p-2">
      <h2 className="w-full text-3xl dark:text-gray-400">Prize</h2>
      <article className="w-full h-96 dark:bg-gray-900 rounded-md flex flex-col p-4 overflow-y-scroll">
        {prizes.map((prize: IPrize, i: number) => {
          return (
            <div
              style={{ color: `${prize.color}` }}
              key={i}
              onClick={() => setSelectedPrize(i)}
              className={`even:bg-gray-800 p-1 cursor-pointer ${i == selectedPrize ? "selected" : ""}`}
            >
              {prize.name}
            </div>
          );
        })}
      </article>
      <div onClick={() => setAddPrizeOverlay(true)} className="m-auto h-12 w-12 text-3xl button">
        +
      </div>
    </div>
  );
};
