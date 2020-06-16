class AttributeDisplay extends Application {
	constructor(actor, options)
	{
		super(options);

		this.actor = actor;
	}

	_buildAttributeStrings(obj, prevstr)
	{
		let attributes = [];
		const type = typeof obj;
		if(type === 'object')
		{
			for(const key in obj)
			{
				const str = prevstr + `.` + key;
				attributes = attributes.concat(this._buildAttributeStrings(obj[key], str));
			}
		}
		else if(type === 'string')
		{
			attributes.push({
				string: prevstr,
				value: `"` + (obj.length < 15 ? obj : (obj.substring(0, 15) + `...`)) + `"`
			})
		}
		else if(type === 'boolean' || type === 'number' || type === 'bigint')
		{
			attributes.push({
				string: prevstr,
				value: obj.toString()
			})
		}
		return attributes;
	}
	
	_getAttributeCategories(obj)
	{
		const categories = [];
		for(const key in obj)
		{
			categories.push({
				name: key,
				attributes: this._buildAttributeStrings(obj[key], key),
			})
		}
		return categories;
	}
	
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 560,
			height: 420,
			classes: ["actor-attribute-display"],
			resizable: true,
			scrollY: [".tab.details"],
			tabs: [{navSelector: ".tabs", contentSelector: ".actor-attribute-display-body"}]
		});
	}

	/* -------------------------------------------- */
  
	/** @override */
	get template() {
		return `modules/actor-attribute-lists/templates/attribute-display.hbs`;
	}
  
	/* -------------------------------------------- */
  
	/** @override */
	getData() {
		const data = super.getData();

		data.categories = this._getAttributeCategories(this.actor.getRollData());

		return data;
	}

	/* -------------------------------------------- */
  
	/** @override */
	get title() {
	  return game.i18n.format("ACTOR-ATTRIBUTE-DISPLAY.Title", {actorName: this.actor.name});
	}
}

async function ShowActorAttributeData(actor) {
	if(actor === null)
	{
		ui.notifications.error(game.i18n.format("ACTOR-ATTRIBUTE-DISPLAY.Error"));
		return;
	}

	new AttributeDisplay(actor).render(true);
}