module.exports = (client, guild, member) => {
    client.serverlogMemberLeft = (member.user.tag, member.user.avatarURL)
};