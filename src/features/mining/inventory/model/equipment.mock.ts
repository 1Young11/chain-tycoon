import type { EquipmentInstance } from './equipment.types'

export const equipmentMock: EquipmentInstance[] = [
   {
      id: 'GPU-00452', modelId: 'nvidia-rtx-3070', name: 'RTX 3070', category: 'gpu', status: 'installed', condition: 94,
      locationId: 'home', locationName: 'Home', farmId: 'home-rig-1', farmName: 'Home Rig #1',
      purchasePriceUsd: 850, currentValueUsd: 690, lifetimeRevenueUsd: 214, runtimeHours: 128, powerWatts: 220,
      cardMetrics: [{ label: 'Hashrate', value: '61 MH/s' }, { label: 'Power', value: '220 W' }],
      performance: [{ algorithmOrCoin: 'Ravencoin', value: '30.5 MH/s' }, { algorithmOrCoin: 'Ergo', value: '121 MH/s' }, { algorithmOrCoin: 'Flux', value: '58 Sol/s' }],
      imageUrl: null,
   },
   {
      id: 'GPU-00812', modelId: 'nvidia-rtx-4060-ti', name: 'RTX 4060 Ti', category: 'gpu', status: 'in_storage', condition: 100,
      locationId: 'storage', locationName: 'Storage', farmId: null, farmName: null,
      purchasePriceUsd: 530, currentValueUsd: 470, lifetimeRevenueUsd: 0, runtimeHours: 0, powerWatts: 160,
      cardMetrics: [{ label: 'Power', value: '160 W' }, { label: 'Hashrate', value: '60 MH/s' }],
      performance: [{ algorithmOrCoin: 'Ravencoin', value: '29.7 MH/s' }, { algorithmOrCoin: 'Ergo', value: '118 MH/s' }, { algorithmOrCoin: 'Flux', value: '56 Sol/s' }],
      imageUrl: null,
   },
   {
      id: 'GPU-00319', modelId: 'amd-rx-7800-xt', name: 'RX 7800 XT', category: 'gpu', status: 'installed', condition: 88,
      locationId: 'garage', locationName: 'Garage', farmId: 'garage-rig-2', farmName: 'Garage Rig #2',
      purchasePriceUsd: 720, currentValueUsd: 640, lifetimeRevenueUsd: 371, runtimeHours: 292, powerWatts: 263,
      cardMetrics: [{ label: 'Hashrate', value: '55 MH/s' }, { label: 'Power', value: '263 W' }],
      performance: [{ algorithmOrCoin: 'Ravencoin', value: '31.1 MH/s' }, { algorithmOrCoin: 'Ergo', value: '126 MH/s' }, { algorithmOrCoin: 'Flux', value: '61 Sol/s' }],
      imageUrl: null,
   },
   {
      id: 'GPU-00188', modelId: 'nvidia-rtx-3060-ti', name: 'RTX 3060 Ti', category: 'gpu', status: 'broken', condition: 34,
      locationId: 'garage', locationName: 'Garage', farmId: 'garage-rig-2', farmName: 'Garage Rig #2',
      purchasePriceUsd: 480, currentValueUsd: 250, lifetimeRevenueUsd: 188, runtimeHours: 410, powerWatts: null,
      cardMetrics: [{ label: 'Power', value: '0 W' }, { label: 'Status', value: 'Repair required' }],
      performance: [{ algorithmOrCoin: 'Ravencoin', value: '0 MH/s' }, { algorithmOrCoin: 'Ergo', value: '0 MH/s' }, { algorithmOrCoin: 'Flux', value: '0 Sol/s' }],
      imageUrl: null,
   },
   {
      id: 'PSU-00104', modelId: 'psu-850-gold', name: '850W Gold PSU', category: 'psu', status: 'in_storage', condition: 96,
      locationId: 'storage', locationName: 'Storage', farmId: null, farmName: null,
      purchasePriceUsd: 165, currentValueUsd: 130, lifetimeRevenueUsd: 0, runtimeHours: 56, powerWatts: null,
      cardMetrics: [{ label: 'Max Output', value: '850 W' }, { label: 'Efficiency', value: '80+ Gold' }], performance: [], imageUrl: null,
   },
   {
      id: 'PSU-00210', modelId: 'psu-1200-platinum', name: '1200W Platinum PSU', category: 'psu', status: 'repairing', condition: 68,
      locationId: 'service-center', locationName: 'Service Center', farmId: null, farmName: null,
      purchasePriceUsd: 315, currentValueUsd: 210, lifetimeRevenueUsd: 0, runtimeHours: 630, powerWatts: null,
      cardMetrics: [{ label: 'Est. Finish', value: '2h 40m' }, { label: 'Efficiency', value: '80+ Platinum' }], performance: [], imageUrl: null,
   },
   {
      id: 'SYS-00012', modelId: 'home-base-system', name: 'Home Mining Base System', category: 'base_system', status: 'installed', condition: 91,
      locationId: 'home', locationName: 'Home', farmId: 'home-rig-1', farmName: 'Home Rig #1',
      purchasePriceUsd: 420, currentValueUsd: 320, lifetimeRevenueUsd: 0, runtimeHours: 128, powerWatts: 70,
      cardMetrics: [{ label: 'Location', value: 'Home' }, { label: 'Farm', value: 'Rig #1' }], performance: [], imageUrl: null,
   },
   {
      id: 'CASE-00045', modelId: 'open-mining-frame-4', name: 'Open Mining Frame', category: 'case', status: 'in_storage', condition: 100,
      locationId: 'storage', locationName: 'Storage', farmId: null, farmName: null,
      purchasePriceUsd: 220, currentValueUsd: 180, lifetimeRevenueUsd: 0, runtimeHours: 0, powerWatts: null,
      cardMetrics: [{ label: 'Capacity', value: '4 GPU Slots' }, { label: 'Type', value: 'Open Frame' }], performance: [], imageUrl: null,
   },
]
