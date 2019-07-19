class Project < ApplicationRecord
	# A project belongs to a team and to a user and has many attr eg = members, activities
	belongs_to :team
	belongs_to :user

	accepts_nested_attributes_for :team

	include PublicActivity::Model
	tracked owner: Proc.new { |controller, model| controller.current_user }
end
