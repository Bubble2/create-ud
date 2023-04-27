const debug = require('debug')('create-ud:generator');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
    async prompting () {
        this.prompts = await this.prompt([
            {
                name: 'reactFeatures',
                message: 'What functionality do you want to enable?',
                type: 'checkbox',
                choices: [
                    { name: 'antd', value: 'antd' },
                    { name: 'dva', value: 'dva' },
                    { name: 'code splitting', value: 'dynamicImport' },
                    { name: 'dll', value: 'dll' },
                    { name: 'internationalization', value: 'locale' },
                ],
            },
        ]);
    }

    writing () {
        this.writeFiles({
            context: {
                name: this.name,
                ...this.prompts,
            },
            filterFiles: f => {
                const { reactFeatures } = this.prompts;
                return true;
            },
        });
    }
}

module.exports = Generator;
