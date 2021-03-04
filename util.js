
const error = () => {
    console.log('Command not recognized, please input another command or type help for available commands')
}

const emailError = () => {
    console.log('Invalid email provided, please re-enter command');
}

const nextCommand = () => {
    console.log('Please input another command');
}

const help = () => {
    console.log('The following commands are avilable: ');
    console.log('   subscribe <email>');
    console.log('   subscribe <email> with code <code>');
    console.log('   get referral count for <email>');
    console.log('   who referred <email>');
    console.log('   who has <email> referred');
    console.log('   who is the biggest influencer')
    console.log('   help')
    console.log('   quit')
    console.log('Please input a command');
}

module.exports = {
    error,
    emailError,
    nextCommand,
    help
};
