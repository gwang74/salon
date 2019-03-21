var HDWalletProvider = require('truffle-hdwallet-provider')
var Personal = require('web3-eth-personal');
const personal = new Personal("https://ropsten.infura.io/v3/2413e0137d6b4a3181d29c8f7727fcf6");
// var mnemonic = "spring bag field fuel cherry swim legal safe day elbow flee sadness"
// console.log(mnemonic)

/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 *   > > Using Truffle V5 or later? Make sure you install the `web3-one` version.
 *
 *   > > $ npm install truffle-hdwallet-provider@web3-one
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

module.exports = {
    /**
     * Networks define how you connect to your ethereum client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */

    networks: {
        // Useful for testing. The `development` name is special - truffle uses it by default
        // if it's defined here and no other network is specified at the command line.
        // You should run a client (like ganache-cli, geth or parity) in a separate terminal
        // tab if you use this network and you must also set the `host`, `port` and `network_id`
        // options below to some value.
        //
        development: {
            // provider: new HDWalletProvider("antique crawl mobile sadness service whisper nephew ritual stool frame bundle equip", "http://127.0.0.1:8545"),
            host: "127.0.0.1", // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            gas: 8000000,
            network_id: "*", // Any network (default: none)
        },
        ropsten: {
            provider: () => new HDWalletProvider("059DAC85987E091ED959E8F9FAEF4D5546364C0F2BBA9F0C7144464853F0B077", "https://ropsten.infura.io/v3/2413e0137d6b4a3181d29c8f7727fcf6"),
            // provider: provider,
            network_id: 3,
            from: "0x8d137e376B784B7C3d9336e10f95311d4B123132",
            gas: 8000000,
            gasPrice: 28921116127,
            overwrite: false
        },
        // rinkeby: {
        //     provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + process.env.INFURA_API_KEY),
        //     network_id: 4,
        //     gas: 8000000,
        //     gasPrice: 28921116127
        // },
        // Another network with more advanced options...
        // advanced: {
        // port: 8777,             // Custom port
        // network_id: 1342,       // Custom network
        // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
        // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
        // from: <address>,        // Account to send txs from (default: accounts[0])
        // websockets: true        // Enable EventEmitter interface for web3 (default: false)
        // },

        // Useful for deploying to a public network.
        // NB: It's important to wrap the provider as a function.
        // ropsten: {
        //     provider: () => new HDWalletProvider(privateKeyRopsten, `https://ropsten.infura.io/${infuraKey}`),
        //     network_id: 3,       // Ropsten's id
        //     gas: 5500000,        // Ropsten has a lower block limit than mainnet
        //     confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        //     timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        //     skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
        // },

        // Useful for private networks
        // private: {
        // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
        // network_id: 2111,   // This network is yours, in the cloud.
        // production: true    // Treats this network as if it was a public net. (default: false)
        // }
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            //version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
            //docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
            settings: { // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "byzantium"
            }
        }
    }
}