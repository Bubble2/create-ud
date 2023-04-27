import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '@utils/axiosBaseQuery';

//异步请求
export default createApi({
    baseQuery: axiosBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
    reducerPath: 'api',
    endpoints: (build) => ({
        getPokemonByName: build.query({
            query: (name) => ({ url: `pokemon/${name}`, method: 'get' }),
            transformResponse: (data) => data.moves
        }),
        getAbcByName: build.query({
            query: (name) => ({ url: `pokemon/${name}`, method: 'get' }),
            transformResponse: (data) => data.moves
        }),
    }),
})