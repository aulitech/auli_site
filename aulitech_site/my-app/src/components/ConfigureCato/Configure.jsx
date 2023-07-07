import React, { useState, useEffect, Fragment } from "react";
import { get, set, clear } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const ConfigureCato = () => {
  const [catoConnected, setCatoConnected] = useState(false);
  const [configSuccess, setConfigSuccess]  = useState(false);
  const [gestureNum, setGestureNum] = useState(0);
  const [prevGesture, setPrevGesture]  = useState('');

  const gestures = [
    {id: 0, name: 'Select'},
    {id: 1, name: 'Nod up'},
    {id: 2, name: 'Nod down'},
    {id: 3, name: 'Nod right'},
    {id: 4, name: 'Nod left'},
    {id: 5, name: 'Tilt right'},
    {id: 6, name: 'Tilt left'},
    {id: 7, name: 'Shake vertical'},
    {id: 8, name: 'Shake horizontal'},
    {id: 9, name: 'Circle clockwise'},
    {id: 10, name: 'Circle counterclockwise'}
  ];
  
  const reset = () => {
    clear();
    setCatoConnected(false);
  }


  const getDirectory = async() => {
    try {
      const dirHandleOrUndefined = await get('directory');

      if (dirHandleOrUndefined) {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
        setCatoConnected(true);
        return;
      }

      const dirHandle = await window.showDirectoryPicker({
        id: 'AULI_CATO',
        mode: 'readwrite'
      });

      await set('directory', dirHandle);
      console.log('store dir handle:', dirHandle.name);
      setCatoConnected(true);
      
    }
    catch(error) {
      console.log("get directory error:", error);
    }
  }


  const writeConfig = async() => {
    //const directory = await get('directory');
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const configFile = await directory.getFileHandle('config.cato', { create: true });
          
          console.log('Config.cato:', configFile);
          
          const writable = await configFile.createWritable();
          console.log(gestureNum);
          await writable.write(gestureNum);
          await writable.close();

          const checkConfig = await directory.getFileHandle('config.cato', { create: false })
          if(checkConfig !== null) {
            setConfigSuccess(true);
          };
        };
      }
    }
    catch(error) {
      console.log("write config.cato error:", error);
    }
  }

  // const handleGestureNums = (e) => {
  //   const numMeanings = {
  //     0: 'Noop',
  //     1: 'Nod up',
  //     2: 'Nod down',
  //     3: 'Nod right',
  //     4: 'Tilt right',
  //     5: 'Tilt left',
  //     6: 'Shake vertical',
  //     7: 'Shake horizontal',
  //     8: 'Circle clockwise',
  //     9: 'Circle counterclockwise',
  //   };

  //   setPrevGesture(numMeanings[gestureNum]);
  //   setGestureNum(e.target.value);

  // }
  // console.log('Previous gesture:', prevGesture);
  // console.log('Gesture num:', gestureNum)


  const HandleConnectDirectoryUI = () => {
    return (        
        <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Connect Cato</h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
              {catoConnected ? 'Connected to AULI_CATO on local computer.' : 'Allow access to Cato. Select AULI_CATO from your local computer.'}
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <button
              type="button"
              className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={catoConnected ? reset : getDirectory}
            >
              {catoConnected ? 'Reset Connection' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>

    )
  }

  const HandleConfigUI = () => {
    return (
      <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Record Gesture</h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm text-gray-500">
            <p>
            Hit start to begin recording gesture.
            </p>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <button
              type="button"
              className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
    )
  };

  const HandleGesturePickerUI = () => {
    const [selected, setSelected] = useState(gestures[0]);

    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
    }

    return (
      <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Select Gesture</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
          Select gesture to record and map to your Cato.
          </p>
        </div>
        <div className="mt-5">
        <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Gestures</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {gestures.map((gesture) => (
                  <Listbox.Option
                    key={gesture.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-blue-300 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={gesture}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {gesture.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-blue-300',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
        </div>
      </div>
    </div>
    )
  }


  return (
    <>
      <HandleConnectDirectoryUI/>
      <HandleGesturePickerUI/>
      <HandleConfigUI/>
    </>
  )
}

export default ConfigureCato;