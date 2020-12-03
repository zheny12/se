const {readFileSync} = require('fs')

const {Telegraf} = require('telegraf')
const express = require('express')
const app = express()
const sleep = require('sleep');
const wake = require('./wakeup');
const port = process.env.PORT || 3000

require('newrelic');
const log = require('ololog');


require('ansicolor');

require('nodemon');
const HEROKU_URL = 'https://escrabota.herokuapp.com';



const {MenuTemplate, MenuMiddleware, createBackMainMenuButtons} = require('telegraf-inline-menu')
const strings = require('./strings');


const resenderConf = require('./resender');

const bot = new Telegraf(resenderConf.token)

app.listen(port), async () => {
	log.green(`Bot app listening at:${port}`);
	log.cyan('Starting Waker Up');
};



const channels = resenderConf.channels;


log.red(`Channel Resender Config. Primary -> ${resenderConf.primary}.`);
log.yellow(`Secondary channels: ${resenderConf.channels}`);




let mediaOption = 'photo1'
const mediaMenu = new MenuTemplate(() => {

	if (mediaOption === strings.menu_about_job) {
		return {
                  type: 'photo',
			media: strings.about_job_image_url,
			text: strings.about_job_desc
		}
	}

	if (mediaOption === 'animation') {
		return {
			type: 'animation',
			media: 'https://telegram.org/img/t_main_Android_demo.mp4',
			text: 'Just a caption for an animation'
		}
	}

	if (mediaOption === 'photo2') {
		return {
			type: 'photo',
			media: 'https://telegram.org/img/SiteAndroid.jpg',
			text: 'Just a caption for a *photo*',
			parse_mode: 'Markdown'
		}
	}

	if (mediaOption === 'document') {
		return {
			type: 'document',
			media: 'https://telegram.org/file/464001088/1/bI7AJLo7oX4.287931.zip/374fe3b0a59dc60005',
			text: 'Just a caption for a <b>document</b>',
			parse_mode: 'HTML'
		}
	}

	if (mediaOption === 'just text') {
		return {
			text: 'Just some text'
		}
	}

	return {
		type: 'photo',
		media: strings.menu_welcome_img_url
	}
})



mediaMenu.submenu(strings.menu_about_job, strings.menu_about_job, buildSubmenu(strings.menu_about_job), {
      joinLastRow: false,
      
})

mediaMenu.submenu(strings.menu_about_us, 'about_us', buildSubmenu('about_us'), {
      joinLastRow: true
})

mediaMenu.submenu(strings.menu_faq, strings.menu_faq, buildSubmenu(strings.menu_faq), {
      joinLastRow: true
})


mediaMenu.submenu(strings.menu_requirements, strings.menu_requirements, buildSubmenu(strings.menu_requirements), {
      joinLastRow: false
})


mediaMenu.submenu(strings.menu_contacts, strings.menu_contacts, buildSubmenu(strings.menu_contacts), {
      joinLastRow: true
})


mediaMenu.submenu(strings.menu_vacancies, strings.menu_vacancies, buildSubmenu(strings.menu_vacancies), {
      joinLastRow: true
})


function buildSubmenu(option) {
      const menu =  new MenuTemplate(() => {

	if (option === strings.menu_about_job) {
		return {
                  type: 'photo',
			media: strings.about_job_image_url,
			text: strings.about_job_desc
		}
	}

	if (option === 'about_us') {
		return {
			text: strings.about_us_desc
		}
      }
      


	if (option === strings.menu_contacts) {
		return {
                  type: 'photo',
			media: strings.contacts_img_url,
			text: strings.contacts_desc
		}
      }
      


	if (option === strings.menu_faq) {
		return {
                  type: 'photo',
			media: strings.about_us_url,
			text: strings.about_job_desc
		}
      }
      



	if (option === strings.menu_vacancies) {
		return {
                  type: 'photo',
                  media: strings.vacancies_img_url
		}
      }
      


	if (option === strings.menu_requirements) {
		return {
                  
			text: strings.requirements_desc
		}
	}

	return {
		type: 'photo',
		media: strings.menu_welcome_img_url
      }
      
      } );
      
      if(option === strings.menu_vacancies) {

            menu.url(strings.vacancy_operator.title, strings.vacancy_operator.url);
            menu.url(strings.vacancy_admin.title, strings.vacancy_admin.url);
            menu.url(strings.vacancy_massage.title, strings.vacancy_massage.url)
            menu.url(strings.vacancy_model.title, strings.vacancy_model.url);
         

      } 
      if(option === strings.menu_faq) {
            menu.url(strings.faq_question_first.title, strings.faq_question_first.url);
            menu.url(strings.faq_question_second.title, strings.faq_question_second.url);
            menu.url(strings.faq_question_third.title, strings.faq_question_third.url);
            menu.url(strings.faq_question_fourth.title, strings.faq_question_fourth.url);
            menu.url(strings.faq_question_fifth.title, strings.faq_question_fifth.url);
            menu.url(strings.faq_question_sixth.title, strings.faq_question_sixth.url);
            menu.url(strings.faq_question_seventh.title, strings.faq_question_seventh.url);

      }


      menu.manualRow(createBackMainMenuButtons(null, () => strings.menu_to_previous));

      menu.url(strings.menu_write_request, strings.request_form_url, {
            joinLastRow:true 
      })
      return menu;
}


const menuMiddleware = new MenuMiddleware('/', mediaMenu)
console.log(menuMiddleware.tree())



 

bot.on('channel_post',  (update) => {
	log.green(`New post from ${update.chat.id}`)
	log.cyan(update)
	if( `@${update.chat.username}` === resenderConf.primary) {
		channels.forEach(async channel => {
			log.yellow(`Sending ${update.channelPost.message_id} to channel ${channel}`)
			log.red('Sleeping 200ms')
			await sleep.msleep(200)
			await update.telegram.forwardMessage(channel, update.chat.id, update.channelPost.message_id)
		});
	}
});



bot.command('start', async ctx => {
      
      await ctx.reply(strings.menu_welcome_text)
      await ctx.reply(strings.menu_hint)
      await menuMiddleware.replyToContext(ctx)

})


bot.use(menuMiddleware.middleware())

bot.catch(error => {
	log.red('telegraf error', error.response, error.parameters, error.on || error)
})



async function startup() {
	await bot.launch()
	log.green (new Date(), 'Bot started as', bot.options.username)
}






app.get('/', (req, res) => {
	res.send({working: true})
})


startup()
    


