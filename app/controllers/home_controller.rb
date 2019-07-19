class HomeController < ApplicationController
  
	def index
  	# if a user is signed in
  	# get current_user value and attri eg projects, teams
	  	if user_signed_in?
	  		@teams = Team.where('id = ?', current_user.team_id)
	  		@projects = Project.where('team_id = ?', current_user.team_id)
	  	end

	  	@activities = PublicActivity::Activity.order('created_at DESC').where(owner_id: current_user, owner_type: 'User')
	end

end
