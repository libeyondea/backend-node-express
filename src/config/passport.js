import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import config from './config';
import User from '~/models/userModel';

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.JWT_ACCESS_TOKEN_SECRET_PUBLIC,
			algorithms: 'RS256'
		},
		async (jwtPayload, done) => {
			try {
				const user = await User.getUserById(jwtPayload.sub);
				if (!user) {
					return done(null, false);
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

export default passport;
