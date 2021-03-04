class User {
    constructor(email, referredBy) {
        this.email = email;
        this.referredBy = referredBy;
        this.referralId;
        this.referrals = [];
    }

    addReferral(referral) {
        this.referrals.push(referral);
    }

    referralCount() {
        return this.referrals.length;
    }

}

module.exports = User;