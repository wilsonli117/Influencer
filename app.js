const readline = require("readline");
const validator = require("email-validator");
const emailValidator = validator.validate;
const generateReferralId = require("randomstring");
const User = require('./user.js');
const util = require('./util');

const app = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    })

    const users = {};
    const existingReferralIds = new Set();

    console.log('Please input a command. Type help for available commands')

    rl.on('line', (input) => {
        const command = input.split(' ');

        if (command[0] === 'subscribe') {
            const email = command[1];

            if (!emailValidator(email)) util.emailError();

            if (command[2] === 'with' && command[3] === 'code') {
                const referralCode = command[4];
                if (existingReferralIds.has(referralCode)) {
                    subscribe(email, referralCode);
                } else {
                    console.log('Invalid referral code, please re-enter command');
                }
            } else if (command.length === 2) {
                subscribe(email);
            } else {
                util.error();
            }
        } else if (command[0] === 'get') {
            if (command[1] === 'referral' && command[2] === 'count' && command[3] === 'for') {
                const email = command[4];
                if (checkEmail(email)) {
                    const user = users[email];
                    console.log(`${user.email} has ${user.referralCount()} referrals`)
                    util.nextCommand();
                }
            } else {
                util.error();
            }
        } else if (command[0] === 'who') {
            if (command[1] === 'referred') {
                const email = command[2];
                if (checkEmail(email)) {
                    const user = users[email];
                    const referrer = findReferrer(user.referredBy)
                    if (referrer) {
                        console.log(`${user.email} was referred by ${referrer.email}`);
                        util.nextCommand();
                    } else {
                        console.log(`${user.email} was not referred by any user`);
                        util.nextCommand();
                    }
                }
            } else if (command[1] === 'has' && command[3] === 'referred') {
                const email = command[2];
                if (checkEmail(email)) {
                    const user = users[email];
                    console.log(`${user.email} has referred ${user.referrals.length ? user.referrals : 'no users'}`)
                    util.nextCommand();
                }
            } else if (command[1] === 'is' && command[2] === 'the' && command[3] === 'biggest' && command[4] === 'influencer') {
                biggestInfluencer();
            } else {
                util.error();
            }
        } else if (command[0] === 'help') {
            util.help();
        } else if (command[0] === 'quit') {
            rl.close();
        } else {
            util.error();
        }
    })

    const checkEmail = (email) => {
        if (!emailValidator(email) || !users[email]) {
            util.emailError();
            return false;
        } else {
            return true;
        }
    }

    const subscribe = (email, referredBy) => {
        const newUser = new User(email, referredBy);
        newUser.referralId = generateReferralId.generate(6);
        while (existingReferralIds.has(newUser.referralId)) {
            newUser.referralId = generateReferralId.generate(6);
        }
        existingReferralIds.add(newUser.referralId);
        users[newUser.email] = newUser;

        if (referredBy) {
            const referrer = findReferrer(referredBy);
            referrer.addReferral(newUser.email);
        }
        
        console.log(`subscribed ${newUser.email} their referral code is ${newUser.referralId}`)
        console.log('Please input another command');
    };

    const findReferrer = (referrerId) => {
        for (const user in users) {
            if (users[user].referralId === referrerId) return users[user];
        }
    }

    const biggestInfluencer = () => {
        let maxInfluence = 0;
        let maxInfluenceUser;

        for(const user in users) {
            const userInfluence = influenceCount(user);
            if (userInfluence > maxInfluence) {
                maxInfluence = userInfluence;
                maxInfluenceUser = user;
            }
        }
        
        if (maxInfluenceUser) {
            console.log(`The biggest influencer is ${maxInfluenceUser} with ${maxInfluence} influenced`)
            util.nextCommand();
        } else {
            console.log('No user has any influence');
            util.nextCommand;
        }
      
    };

    const influenceCount = (user) => {
        let count = 0;
        const stack = [user];

        while (stack.length) {
            let currUser = users[stack.pop()];
            count += currUser.referralCount();
            currUser.referrals.forEach(referral => stack.push(referral));
        }

        return count;
    };
}

app();


