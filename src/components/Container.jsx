import update from "immutability-helper";
import { useCallback, useState, useEffect } from "react";
import { Card } from "./Card.jsx";

const style = {
  width: "auto",
};
export const Container = ({ myProductData, setProducts, deleteHandler }) => {
  {
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setProducts((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);
    const renderCard = useCallback((card, index) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          variants={card.variants}
          moveCard={moveCard}
          deleteCard={deleteHandler}
          setProducts={setProducts}
          myProductData={myProductData}
        />
      );
    }, []);

    return (
      <>
        <div style={style}>
          {myProductData.map((card, i) => renderCard(card, i))}
        </div>
      </>
    );
  }
};
