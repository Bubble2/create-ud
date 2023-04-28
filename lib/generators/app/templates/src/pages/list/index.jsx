import React, { useState, useMemo, useEffect } from "react";
import { Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import api from '@state/api'

const { useLazyGetPokemonByNameQuery, useLazyGetAbcByNameQuery } = api

export default () => {
    const dispatch = useDispatch();
    const [getPokemonByName, pokemonResult] = useLazyGetPokemonByNameQuery()
    const [getAbcByName, abcResult] = useLazyGetAbcByNameQuery()

    const fetchData = () => {
        getPokemonByName('bulbasaur');
        getAbcByName('ditto')
    }

    return (
        <>
            <Button type="primary" onClick={fetchData}>load data</Button>
            <Spin spinning={pokemonResult.isLoading || abcResult.isLoading}>
                <ul>
                    {
                        pokemonResult.data && pokemonResult.data.map((item, index) => {
                            return <li key={index}>{item.move.name}</li>
                        })
                    }
                </ul>
                <br />
                <ul>
                    {
                        abcResult.data && abcResult.data.map((item, index) => {
                            return <li key={index}>{item.move.name}</li>
                        })
                    }
                </ul>
            </Spin>
        </>
    );
};
