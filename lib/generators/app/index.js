const debug = require('debug')('create-ud:generator');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
    async prompting () {
        this.prompts = await this.prompt([
            {
                name: 'fnFeatures',
                message: 'What functionality do you want to enable?',
                type: 'checkbox',
                choices: [
                    { name: 'web3', value: 'web3' }
                ],
            },
        ]);
    }

    isWeb3File (file) {
        if (!file) return false;
        const componentsPath = 'src/components';
        const constantsPath = 'src/constants';
        const hooksPath = 'src/hooks';
        const imagesPath = 'src/images';
        const statePath = 'src/state';
        const utilsPath = 'src/utils';
        const web3FileArr = [
            `${componentsPath}/biz/approveBtn`,
            `${componentsPath}/biz/connectWallet`,
            `${componentsPath}/biz/switchChain`,
            `${componentsPath}/biz/tokenBalanceUpdater`,
            `${componentsPath}/biz/tokenListUpdater`,
            `${componentsPath}/biz/transactionUpdater`,
            `${componentsPath}/biz/walletModal`,
            `${constantsPath}/abi`,
            `${constantsPath}/tokenList`,
            `${constantsPath}/contractAddress`,
            `${hooksPath}/useApprove`,
            `${hooksPath}/useChainId`,
            `${hooksPath}/useContractAddress`,
            `${hooksPath}/useContractWithNotification`,
            `${hooksPath}/useTokenAllowance`,
            `${hooksPath}/useTokenBalance`,
            `${hooksPath}/useTokenList`,
            `${imagesPath}/metaMask`,
            `${imagesPath}/walletConnect`,
            `${statePath}/tokenSlice`,
            `${statePath}/transactionSlice`,
            `${utilsPath}/createClient`,
        ];
        return web3FileArr.filter(item => {
            return file.indexOf(item) > -1
        }).length > 0
    }

    writing () {
        this.writeFiles({
            context: {
                name: this.name,
                ...this.prompts,
            },
            filterFiles: f => {
                const { fnFeatures } = this.prompts;
                debug(`file1 ${f}`)
                if (!fnFeatures.includes('web3')) {
                    if (this.isWeb3File(f)) {
                        debug(`file2 ${f}`)
                        return false;
                    }
                }
                return true;
            },
        });
    }
}

module.exports = Generator;
