################################################################################
# Configuration file for markdownlint.
#
# https://github.com/markdownlint/markdownlint/blob/master/docs/configuration.md
#
# Order of preference for markdownlint config file (first one wins):
#   ${PWD}/.mdlrc
#   ${HOME}/.mdlrc
################################################################################

# frozen_string_literal: true

################################################################################
# Style file for markdownlint.
#
# https://github.com/markdownlint/markdownlint/blob/master/docs/configuration.md
#
# This file is referenced by the project `.mdlrc`.
################################################################################

#===============================================================================
# Start with all built-in rules.
# https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md
all

#===============================================================================
# Override default parameters for some built-in rules.
# https://github.com/markdownlint/markdownlint/blob/master/docs/creating_styles.md#parameters

exclude_rule 'MD013'
exclude_rule 'MD032'
exclude_rule 'MD041'
exclude_rule 'MD029'
exclude_rule 'MD022'
exclude_rule 'MD002'
exclude_rule 'MD034'
exclude_rule 'MD024'
exclude_rule 'MD012'
exclude_rule 'MD001'
