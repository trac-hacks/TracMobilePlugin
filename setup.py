# -*- coding: utf8 -*-
#
# Copyright (C) Cauly Kan, mail: cauliflower.kan@gmail.com
# All rights reserved.
#
# This software is licensed as described in the file COPYING, which
# you should have received as part of this distribution.


'''
Created on 2018.03.22

@author: cauly
'''
from setuptools import find_packages, setup

setup(
    name='TracMobilePlugin', version='1.0',
    packages=find_packages(exclude=['*.tests*']),
    license = "BSD 3-Clause",
    author_email='cauliflower.kan@gmail.com',
    author='Cauly Kan',
    package_data={ 'tracmobile': ['htdocs/*.js', 'htdocs/images/*.*', 'htdocs/*.css', 'htdocs/*.html'] },
    install_requires=['Trac'],
    extras_require={
        'tracrpc': 'TracXMLRPC >= 1.1.0',
    },
    entry_points={
        'trac.plugins': [
            'TracMobilePlugin.api = tracmobile.api',
            'TracMobilePlugin.xmlrpc = tracmobile.xmlrpc'
        ],
    },
)
