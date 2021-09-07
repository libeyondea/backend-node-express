import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET_KEY, TOKEN_TYPES } from './env';
import passport from 'passport';
import * as userService from '~/services/userService';

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: JWT_SECRET_KEY
		},
		async (jwtPayload, done) => {
			try {
				if (jwtPayload.type !== TOKEN_TYPES.ACCESS) {
					return done(null, false);
				}
				const user = await userService.getUserById(jwtPayload.sub);
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
