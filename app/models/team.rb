class Team < ApplicationRecord
	# A team should have many projects, and many users

	has_many :projects, dependent: :destroy
	has_many :users

	accepts_nested_attributes_for :users, allow_destroy: true
end
