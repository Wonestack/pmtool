// Import Vue Js resourses and files
import Vue from 'vue/dist/vue.esm'
import VueResource from 'vue-resource'

// initialize Vue Resources 
// To be able to make use of it
Vue.use(VueResource)

// Get vue to work nicely with Rails turbolinks
// by patching and merging the csrf token together
document.addEventListener('turbolinks:load', () => {

	Vue.http.headers.common['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

	// Create the js form by referencing it in rails
	let element = document.getElementById('team-form')

	// check if form is created above
	if (element != null) {

		let id = element.dataset.id
		let team = JSON.parse(element.dataset.team)
		let users_attributes = JSON.parse(element.dataset.usersAttributes)
		users_attributes.forEach( function (user) {
			user._destroy = null			
		})
		team.users_attributes = users_attributes

		// instantiate Vue 
		let app = new Vue({
			el: element,
			data: function(){
				// define values to send to rails
				return{
					id: id,
					team: team,
					errors: [],
					scrollPosition: null
				}
			},
			// define a method
			mounted(){
				window.addEventListener('scroll', this.updateScroll);
			},
			methods: {

				updateScroll() {
					this.scrollPosition = window.scrollY
				},

				addUser: function() {
					this.team.users_attributes.push({
						id: null,
						name: '',
						email: '',
						_destroy: null
					})
				},

				// remove user|do functionality
				removeUser: function(index) {
					let user = this.team.users_attributes[index]

					if (user.id == null) {
						this.team.users_attributes.splice(index, 1)
					}else {
						this.team.users_attributes._destroy = '1'
					}
				},

				// undo functionality
				undoRemove: function(index) {
					this.team.users_attributes[index]._destroy = null
				},

				// save team/ create a new team
				saveTeam: function() {
					if(this.id == null) {
						this.$http.post('/teams/', { team: this.team}).then(response => {
							Turbolinks.visit(`/teams/${response.body.id}`)
						},

						response => { 
							console.log(response)
							
							if (response.status = 422) {
								let json = JSON.parse(response.bodyText);

								this.errors = json['users.email'][0];
							}
						})

						// edit existing team functionality

					}else {
						this.$http.put(`/teams/${this.id}`, {team: this.team}).then(response => {
							Turbolinks.visit(`/teams/${response.body.id}`)
						}, response => {
							console.log(response)
						})
					}
						
				},

				existingTeam: function() {
					return this.team.id != null
				}
			}
			
		})
	}

})