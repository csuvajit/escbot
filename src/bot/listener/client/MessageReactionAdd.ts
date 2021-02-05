import { MessageReaction, User, Guild } from 'discord.js';
import { SETTINGS } from '../../util/Constants';
import { Listener } from 'discord-akairo';

export default class MessageReactionAddListener extends Listener {
	public constructor() {
		super('messageReactionAdd', {
			event: 'messageReactionAdd',
			emitter: 'client',
			category: 'client'
		});
	}

	public async exec(reaction: MessageReaction, user: User) {
		if (user.id === this.client.user!.id) return;
		if (reaction.message.partial) await reaction.message.fetch(); // eslint-disable-line
		if (!reaction.message.guild) return;

		if (reaction.emoji.name === '📢') {
			const roleID = this.client.settings.get<string>(reaction.message.guild, SETTINGS.REACTION_ROLE, '807254345526804522');
			if (!reaction.message.guild.roles.cache.has(roleID)) return;

			const member = await this.getMember(reaction.message.guild, user.id);
			if (!member) return;

			return member.roles.add(roleID).catch(() => null);
		}
	}

	private getMember(guild: Guild, id: string) {
		if (guild.members.cache.has(id)) {
			return guild.members.cache.get(id);
		}
		return guild.members.fetch(id).catch(() => null);
	}
}
