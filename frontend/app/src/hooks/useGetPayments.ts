import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USER_STEALTH_ADDRESSES } from '../graphql/codegen/queries/User';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formatUnits } from 'viem';

export type UseGetPaymentsParams = {
  pause?: boolean,
  address: string,
  intervalInSeconds: number,
};

export type Payment = {
  from: string,
  thHash: string,
  amount: string,
  stealthAddress: string,
  timestamp: number,
};

export type UseGetPaymentsResponse = {
  payments: Payment[];
  loading: boolean;
};


export const useGetPayments = (params: UseGetPaymentsParams): UseGetPaymentsResponse => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentsToReturn, setPaymentsToReturn] = useState<Payment[]>([]);

  const queryRunRef = useRef(false);

  const [getStealthAddresses, { data: stealthAddressesRetrieved, loading }] = useLazyQuery(GET_USER_STEALTH_ADDRESSES, {
    variables: { address: params.address },
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (params.pause) return;
    const intervalId = setInterval(() => {
      queryRunRef.current = true;
      setIsLoading(true);
      getStealthAddresses();
    }, !params.intervalInSeconds || params.intervalInSeconds<5 ? 5000 : params.intervalInSeconds * 1000);
    return () => clearInterval(intervalId);
  }, [params.pause, params.intervalInSeconds]);

  // logic to refresh the tokens
  useEffect(() => {
    if (queryRunRef.current && stealthAddressesRetrieved && stealthAddressesRetrieved?.getUserStealthAddresses) {
      (async () => {
        let tmpPayments: Payment[] = [];
        const stealthAddresses = stealthAddressesRetrieved.getUserStealthAddresses;
        if (!stealthAddresses) return;
        let promises = stealthAddresses.map((s: any) => {
          return new Promise((resolve) => {
            axios.get(`https://base-goerli.blockscout.com/api/v2/addresses/${s}/transactions`)
              .then(response => {
                resolve(response);
              })
              .catch(error => {
                resolve(null);
              });
          });
        });
        const fetchTxs = await Promise.all(promises);
        let pos = 0;
        for (let ft of fetchTxs) {
          if (ft === null) {
            pos++;
            continue; // Skip this iteration if the API call returned a 404
          }
          const stealthAddress = stealthAddresses[pos] as string;
          // @ts-ignore
          for (let st of ft?.data.items) {
            // loop hrough each tx
            tmpPayments.push({
              from: st.from.hash as string,
              stealthAddress: stealthAddress,
              amount: formatUnits(BigInt(st.value), 18),
              thHash: st.hash,
              timestamp: Math.floor((new Date(st.timestamp)).getTime()/1000)
            })
          }
          pos++;
        }
        setPaymentsToReturn(tmpPayments);
        queryRunRef.current = false; // reset the ref
        setIsLoading(false);
      })();
    }
  }, [stealthAddressesRetrieved]);

  return {
    payments: paymentsToReturn,
    loading
  };
};
